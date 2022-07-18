import * as React from 'react';

import { InspectorRow } from './InspectorRow';

import './Inspector.css';

interface SelectionInspectorProps {
  selectedData: any;
}

export class SelectionInspector extends React.PureComponent<SelectionInspectorProps, {}> {
  /**
   * Render the object data, passing down property keys and values.
   */
  private renderObjectDetails() {
    const selObj = this.props.selectedData;
    const dets = [];
    for (const k in selObj) {
      const val = selObj[k];
      const row = <InspectorRow
                    key={k}
                    id={k}
                    value={val}
                  />;
      if (k === 'key') {
        dets.unshift(row); // key always at start
      } else {
        dets.push(row);
      }
    }
    return dets;
  }

  public render() {
    return (
      <div id='myInspectorDiv' className='inspector'>
        <table>
          <tbody>
            {this.renderObjectDetails()}
          </tbody>
        </table>
      </div>
    );
  }
}
