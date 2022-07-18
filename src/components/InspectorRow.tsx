import * as React from 'react';
import './Inspector.css';

interface InspectorRowProps {
  id: string;
  value: string;
}

export class InspectorRow extends React.PureComponent<InspectorRowProps, {}> {
  constructor(props: InspectorRowProps) {
    super(props);
  }

  private formatLocation(loc: string): string {
    const locArr = loc.split(' ');
    if (locArr.length === 2) {
      const x = parseFloat(locArr[0]);
      const y = parseFloat(locArr[1]);
      if (!isNaN(x) && !isNaN(y)) {
        return `${x.toFixed(0)} ${y.toFixed(0)}`;
      }
    }
    return loc;
  }

  public render() {
    let val = this.props.value;
    if (this.props.id === 'loc') {
      val = this.formatLocation(this.props.value);
    }
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>
          <input
            disabled={this.props.id === 'key'}
            value={val}
          >
          </input>
        </td>
      </tr>
    );
  }
}
