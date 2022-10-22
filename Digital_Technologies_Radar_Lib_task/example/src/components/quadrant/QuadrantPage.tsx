import React from 'react';
import {
  SelectionState,
  Utilities,
  TechList,
  Filter,
  DataLists,
  Radar,
  RadarResponsive
} from '@undp_sdg_ai_lab/undp-radar';
import { SpinnerRoundFilled } from 'spinners-react/lib/esm/SpinnerRoundFilled';

import { CenterColumn } from '../../layout/CenterColumn';
import { Layout } from '../../layout/Layout';
import { LeftColumn } from '../../layout/LeftColumn';
import { RightColumn } from '../../layout/RightColumn';

import './QuadrantPage.scss';

export const QuadrantPage: React.FC = () => (
  <SelectionState>
    {({
      selectedQuadrant,
      logic: { setSelectedQuadrant, setSelectedItem }
    }): JSX.Element => (
      <div className='App'>
        {selectedQuadrant && (
          <Layout>
            <LeftColumn>
              <div style={{ position: 'absolute', top: 20, left: 0 }}>
                <button
                  type='button'
                  onClick={(): void => {
                    setSelectedQuadrant(null);
                    setSelectedItem(null);
                  }}
                  className={'radar-button'}
                >
                  <span style={{ fontSize: 30 }}>&#10094;</span>
                </button>
              </div>
              <TechList showTitle={false} />
              <Filter />
            </LeftColumn>

            <CenterColumn>
              <h3 style={{ textAlign: 'center' }}>
                {Utilities.capitalize(selectedQuadrant)}
              </h3>
              <RadarResponsive
                Spinner={
                  <SpinnerRoundFilled
                    size={'25%'}
                    thickness={100}
                    speed={100}
                    color='rgba(175, 175, 175, 1)'
                  />
                }
                Component={Radar}
              />
            </CenterColumn>

            <RightColumn>
              <DataLists />
            </RightColumn>
          </Layout>
        )}
      </div>
    )}
  </SelectionState>
);
