import React from 'react';
import { useDataState, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

/**
 * @impl example of PopOver
 */
export const PopOver: React.FC = () => {
  const {
    state: { hoveredItem, hoveredQuadOrHorizon }
  } = useRadarState();
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  // TODO: here we can calculate X mouse position, width of inner div (first div of this comp)
  // and decide on placement strategz
  return (
    <div
      style={{
        backgroundColor: 'pink',
        padding: 10,
        boxShadow: '5px 5px 15px 0px rgba(0,0,0,0.25)',
        borderRadius: 10
      }}
    >
      {hoveredItem && hoveredItem[titleKey]}
      {hoveredQuadOrHorizon &&
        (Array.isArray(hoveredQuadOrHorizon) ? (
          hoveredQuadOrHorizon.map((h, i) => (
            <div key={i}>
              <div>{h.title}</div>
              {h.description && <div>{h.description}</div>}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'start' }}>
            <div>{hoveredQuadOrHorizon.title}</div>
            {hoveredQuadOrHorizon.description && (
              <div>{hoveredQuadOrHorizon.description}</div>
            )}
          </div>
        ))}
    </div>
  );
};
