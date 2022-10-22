import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  SelectionState,
  DataLists,
  TechList,
  Filter,
  TechOrBlipDescription,
  BlipPage,
  Radar,
  RadarResponsive
} from '@undp_sdg_ai_lab/undp-radar';

import { Layout } from '../layout/Layout';
import { LeftColumn } from '../layout/LeftColumn';
import { RightColumn } from '../layout/RightColumn';
import { CenterColumn } from '../layout/CenterColumn';
import { QuadrantPage } from '../components/quadrant/QuadrantPage';
import { SpinnerRoundFilled } from 'spinners-react/lib/esm/SpinnerRoundFilled';

export const RadarApp: React.FC = () => (
  <SelectionState>
    {({ selectedItem, selectedQuadrant }): JSX.Element => (
      <React.Fragment>
        <div className='App'>
          {!selectedQuadrant && !selectedItem && (
            <Layout>
              <LeftColumn>
                <Switch>
                  <Route
                    exact
                    path='/'
                    render={(): JSX.Element => <TechList showTitle={false} />}
                  />
                </Switch>

                <Switch>
                  <Route exact path='/' component={Filter} />
                </Switch>
              </LeftColumn>

              <CenterColumn>
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
                <TechOrBlipDescription />
              </CenterColumn>

              <RightColumn>
                <DataLists />
              </RightColumn>
            </Layout>
          )}
          {selectedItem && <BlipPage />}
          {!selectedItem && selectedQuadrant && <QuadrantPage />}
        </div>
      </React.Fragment>
    )}
  </SelectionState>
);
