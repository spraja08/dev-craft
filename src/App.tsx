/*
*  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';

import { DiagramWrapper } from './components/DiagramWrapper';
import { SelectionInspector } from './components/SelectionInspector';
import { SelectionView } from './components/SelectionView';
import { Drawer } from "@material-ui/core";
import './App.css';

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
interface AppState {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  selectedData: go.ObjectData | null;
  skipsDiagramUpdate: boolean;
  drawerOpen: boolean;
}

class App extends React.Component<{}, AppState> {
  // Maps to store key -> arr index for quick lookups
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;

  constructor(props: object) {
    super(props);
    this.state = {
      nodeDataArray: [
        { key: "SUPERSTAR DEVELOPER", text: 'SUPERSTAR DEVELOPER', color: 'red', loc: '0 0' },
        { key: "Vision Creation", text: 'Vision Creation', color: '#0080ff', loc: '0 0' },
        { key: "Vision Execution", text: 'Vision Execution', color: '#0080ff', loc: '0 0' },
        { key: "Building", text: 'Building', color: '#00b300', loc: '0 0' },

        { key: "Non Functional", text: 'Non Functional', color: '#990099', loc: '0 0' },
        { key: "Cost", text: 'Cost', color: '#ff00ff', loc: '150 0' },
        { key: "Operational Excellence", text: 'Operational Excellence', color: '#ff00ff', loc: '0 150' },
        { key: "Reliability", text: 'Reliability', color: '#ff00ff', loc: '150 150' },
        { key: "Performance", text: 'Performance', color: '#ff00ff', loc: '150 150' },
        { key: "Security", text: 'Security', color: '#ff00ff', loc: '150 150' },
        { key: "Sustainability", text: 'Sustainability', color: '#ff00ff', loc: '150 150' }

      ],
      linkDataArray: [
        { key: 0, from: "SUPERSTAR DEVELOPER", to: "Vision Creation" },
        { key: 1, from: "SUPERSTAR DEVELOPER", to: "Vision Execution" },
        { key: 2, from: "Vision Execution", to: "Building" },
        { key: 3, from: "Building", to: "Non Functional" },

        { key: 4, from: "Non Functional", to: "Cost" },
        { key: 5, from: "Non Functional", to: "Operational Excellence" },
        { key: 6, from: "Non Functional", to: "Operational Excellence" },
        { key: 7, from: "Non Functional", to: "Reliability" },
        { key: 8, from: "Non Functional", to: "Performance" },
        { key: 9, from: "Non Functional", to: "Security" },
        { key: 10, from: "Non Functional", to: "Sustainability" },

      ],
      modelData: {
        canRelink: true
      },
      selectedData: null,
      skipsDiagramUpdate: false,
      drawerOpen: false
    };
    // init maps
    this.mapNodeKeyIdx = new Map<go.Key, number>();
    this.mapLinkKeyIdx = new Map<go.Key, number>();
    this.refreshNodeIndex(this.state.nodeDataArray);
    this.refreshLinkIndex(this.state.linkDataArray);
    // bind handler methods
    this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  private readMetaData(): void {
  }
  /**
   * Update map of node keys to their index in the array.
   */
  private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
    this.mapNodeKeyIdx.clear();
    nodeArr.forEach((n: go.ObjectData, idx: number) => {
      this.mapNodeKeyIdx.set(n.key, idx);
    });
  }

  /**
   * Update map of link keys to their index in the array.
   */
  private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
    this.mapLinkKeyIdx.clear();
    linkArr.forEach((l: go.ObjectData, idx: number) => {
      this.mapLinkKeyIdx.set(l.key, idx);
    });
  }

  /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
  public handleDiagramEvent(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        this.setState(
          produce((draft: AppState) => {
            if (sel) {
              if (sel instanceof go.Node) {
                const idx = this.mapNodeKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const nd = draft.nodeDataArray[idx];
                  draft.selectedData = nd;
                }
              } else if (sel instanceof go.Link) {
                const idx = this.mapLinkKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const ld = draft.linkDataArray[idx];
                  draft.selectedData = ld;
                }
              }
              draft.drawerOpen = true;
            } else {
              draft.selectedData = null;
            }
          })
        );
        break;
      }
      default: break;
    }
  }

  public toggleDrawer() {
      this.setState({drawerOpen: false});
  }

  public render() {
    const selectedData = this.state.selectedData;
    let inspector;
    if (selectedData !== null) {
      inspector = <SelectionInspector
                    selectedData={this.state.selectedData}
                  />;
    }

    return (
      <div>
        <p>
        </p>
        <DiagramWrapper
          nodeDataArray={this.state.nodeDataArray}
          linkDataArray={this.state.linkDataArray}
          modelData={this.state.modelData}
          skipsDiagramUpdate={this.state.skipsDiagramUpdate}
          onDiagramEvent={this.handleDiagramEvent}
        />
        <Drawer 
          PaperProps={{ style: { width: "30%" } }}
          anchor={"right"}
          open={this.state.drawerOpen}
          onClose={this.toggleDrawer}>
            <SelectionView selectedData={this.state.selectedData}/>
        </Drawer>
        
      </div>
    );
  }
}

export default App;
