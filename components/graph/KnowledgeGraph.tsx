'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '@/lib/store';

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'room' | 'note';
  color: string;
  radius: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

const MAX_NOTE_LABEL_LENGTH = 20;

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { rooms, notes, setSelectedNote, setCurrentView } = useStore();
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);
  const [insightMode, setInsightMode] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    const nodes: SimNode[] = [
      ...rooms.map((r) => ({ id: r.id, label: r.name, type: 'room' as const, color: r.color, radius: 22 })),
      ...notes.map((n) => {
        const room = rooms.find((r) => r.id === n.roomId);
        return { id: n.id, label: n.title, type: 'note' as const, color: room?.color || '#6366f1', radius: 10 };
      }),
    ];

    const links: SimLink[] = [
      ...notes.map((n) => ({ source: n.roomId, target: n.id })),
      ...notes.flatMap((n) => n.links.map((l) => ({ source: n.id, target: l }))),
    ].filter((l) => {
      const srcId = typeof l.source === 'string' ? l.source : (l.source as SimNode).id;
      const tgtId = typeof l.target === 'string' ? l.target : (l.target as SimNode).id;
      return nodes.find((n) => n.id === srcId) && nodes.find((n) => n.id === tgtId);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => { g.attr('transform', event.transform); });

    svg.call(zoom);

    const g = svg.append('g');

    // Gradient defs
    const defs = svg.append('defs');
    nodes.filter((n) => n.type === 'room').forEach((n) => {
      const grad = defs.append('radialGradient').attr('id', `grad-${n.id}`);
      grad.append('stop').attr('offset', '0%').attr('stop-color', n.color).attr('stop-opacity', 0.8);
      grad.append('stop').attr('offset', '100%').attr('stop-color', n.color).attr('stop-opacity', 0.2);
    });

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<SimNode>().radius((d) => d.radius + 10));

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 1);

    const node = g.append('g')
      .selectAll<SVGCircleElement, SimNode>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => d.type === 'room' ? `url(#grad-${d.id})` : `${d.color}33`)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => d.type === 'room' ? 2 : 1)
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGCircleElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      )
      .on('mouseover', (event, d) => {
        setTooltip({ x: event.clientX, y: event.clientY, label: d.label });
      })
      .on('mouseout', () => setTooltip(null))
      .on('click', (_, d) => {
        if (d.type === 'note') { setSelectedNote(d.id); setCurrentView('notes'); }
      });

    const label = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.type === 'room' ? d.label : d.label.slice(0, MAX_NOTE_LABEL_LENGTH) + (d.label.length > MAX_NOTE_LABEL_LENGTH ? '…' : ''))
      .attr('fill', (d) => d.type === 'room' ? d.color : 'rgba(255,255,255,0.6)')
      .attr('font-size', (d) => d.type === 'room' ? '12px' : '9px')
      .attr('font-weight', (d) => d.type === 'room' ? '600' : '400')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.radius + 14)
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x!)
        .attr('y1', (d) => (d.source as SimNode).y!)
        .attr('x2', (d) => (d.target as SimNode).x!)
        .attr('y2', (d) => (d.target as SimNode).y!);
      node.attr('cx', (d) => d.x!).attr('cy', (d) => d.y!);
      label.attr('x', (d) => d.x!).attr('y', (d) => d.y!);
    });

    return () => { simulation.stop(); };
  }, [rooms, notes, insightMode, setSelectedNote, setCurrentView]);

  return (
    <div className="relative h-full bg-[#0a0a0f]">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="glass px-4 py-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Knowledge Graph</h2>
          <p className="text-xs text-[var(--text-secondary)]">{rooms.length} rooms · {notes.length} notes · Drag to explore</p>
        </div>
        <button
          onClick={() => setInsightMode(!insightMode)}
          className={`glass px-3 py-2 text-xs font-medium transition-colors ${insightMode ? 'text-indigo-300' : 'text-[var(--text-secondary)]'}`}
        >
          Insight Mode {insightMode ? 'ON' : 'OFF'}
        </button>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
      {tooltip && (
        <div
          className="fixed z-50 glass px-3 py-1.5 text-xs text-[var(--text-primary)] pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 20 }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
}
