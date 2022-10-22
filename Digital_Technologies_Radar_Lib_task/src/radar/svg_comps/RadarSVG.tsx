import React from 'react';

import { Translate } from './Translate';
import { Horizons } from './Horizons';
import { useRadarState } from '../../stores/radar.state';
import { useDataState } from '../../stores/data.state';
import { QuadOrOrizonOptsType } from '../../types';
import { Utilities } from '../../helpers/Utilities';

const DEFAULT_HEIGHT = 600;
const DEFAULT_WIDTH = 600;

interface Props {
  dimensions?: {
    h: number;
    w: number;
  };
}

export const RadarSVG: React.FC<Props> = ({
  dimensions = {
    h: DEFAULT_HEIGHT,
    w: DEFAULT_WIDTH
  }
}) => {
  const {
    state: { hoveredQuadOrHorizon, radarData },
    actions: { setHoveredQuadOrHorizon }
  } = useRadarState();

  const {
    state: {
      ui: { popupDisabled },
      descriptions: { horizons: horizonsDescription },
      HorizonsNameComponent
    },
    actions: { setUiPopup }
  } = useDataState();

  const ref = React.useRef<SVGSVGElement>(null);

  const { h: height, w: width } = dimensions;

  const { radarOptions, horizons } = radarData;
  const { horizonShiftRadius } = radarOptions;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - horizonShiftRadius) / horizons.length;

  const closeTooltip = (): void => {
    setUiPopup({ isShown: false });
    setHoveredQuadOrHorizon(null);
  };

  const onMouseEnter = (
    quadObj: QuadOrOrizonOptsType | QuadOrOrizonOptsType[]
  ): void => {
    if (Array.isArray(quadObj)) {
      setHoveredQuadOrHorizon(
        quadObj.map((q) => {
          return {
            title: Utilities.capitalize(q.title),
            description: q.description
          };
        })
      );
    } else {
      setHoveredQuadOrHorizon({
        title: Utilities.capitalize(quadObj.title),
        description: quadObj.description
      });
    }
  };

  return (
    <React.Fragment>
      <svg ref={ref} width={width} height={height}>
        <Translate x={width / 2} y={height / 2}>
          <Horizons
            hoveredQuadOrHorizon={hoveredQuadOrHorizon}
            setHoveredQuadOrHorizon={setHoveredQuadOrHorizon}
          />
        </Translate>
      </svg>
      <div style={{ position: 'relative' }}>
        <svg
          width={26}
          height={25}
          style={{ position: 'absolute', right: 8, top: -height / 2 - 13 }}
        >
          {horizonUnit && HorizonsNameComponent ? (
            <React.Fragment>
              <Translate x={3} y={13}>
                {HorizonsNameComponent && (
                  <HorizonsNameComponent
                    className={`maturity-levels-desc`}
                    onMouseMove={(e): void =>
                      setUiPopup({
                        top: e.pageY - 50,
                        left: e.pageX + 15,
                        isShown: popupDisabled ? false : true
                      })
                    }
                    onMouseOut={closeTooltip}
                    onMouseEnter={(): void =>
                      onMouseEnter(
                        horizons.map((h) => ({
                          title: h,
                          description: horizonsDescription
                            ? horizonsDescription[h?.toLowerCase()]
                            : undefined
                        }))
                      )
                    }
                  />
                )}
              </Translate>
            </React.Fragment>
          ) : null}
        </svg>
      </div>
    </React.Fragment>
  );
};
