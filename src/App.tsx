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
        { key: "Prototyping", text: 'Prototyping', color: '#00b300', loc: '0 0' },
        { key: "Deploying", text: 'Deploying', color: '#00b300', loc: '0 0' },
        { key: "Estimating", text: 'Estimating', color: '#00b300', loc: '0 0' },

        { key: "Managing Complexity", text: 'Managing Complexity', color: '#5900b3', loc: '0 0' },
        { key: "Design Principles", text: 'Design Principles', color: '#8000ff', loc: '0 0' },
        { key: "Data Structures", text: 'Data Structures', color: '#8000ff', loc: '0 0' },
        { key: "Algorithms", text: 'Algorithms', color: '#8000ff', loc: '0 0' },
        { key: "Essential Maths", text: 'Essential Maths', color: '#8000ff', loc: '0 0' },
        { key: "Modelling", text: 'Modelling', color: '#8000ff', loc: '0 0' },

        { key: "Frameworks", text: 'Frameworks', color: '#cc6600', loc: '0 0' },
        { key: "Programming Paradigms", text: 'Programming Paradigms', color: '#446600', loc: '0 0' },
        { key: "Clean Coding Principles", text: 'Clean Coding Principles', color: '#00b3b3', loc: '0 0' },

        { key: "Non Functional", text: 'Non Functional', color: '#990099', loc: '0 0' },
        { key: "Cost", text: 'Cost', color: '#ff00ff', loc: '150 0' },
        { key: "Operational Excellence", text: 'Operational Excellence', color: '#ff00ff', loc: '0 150' },
        { key: "Reliability", text: 'Reliability', color: '#ff00ff', loc: '150 150' },
        { key: "Performance", text: 'Performance', color: '#ff00ff', loc: '150 150' },
        { key: "Security", text: 'Security', color: '#ff00ff', loc: '150 150' },
        { key: "Sustainability", text: 'Sustainability', color: '#ff00ff', loc: '150 150' },

        { key: "Domain Driven Design", text: 'Domain Driven Design', color: '#ff3377', loc: '0 0' },
        { key: "Application Modelling", text: 'Application Modelling', color: '#ff3377', loc: '0 0' },
        { key: "Data Modelling", text: 'Data Modelling', color: '#ff3377', loc: '0 0' },
        { key: "Decision Records", text: 'Decision Records', color: '#ff3377', loc: '0 0' },

        { key: "Working Backwards", text: 'Working Backwards', color: '#cc00cc', loc: '0 0' },
        { key: "Stakeholder Management", text: 'Stakeholder Management', color: '#cc00cc', loc: '0 0' },
        { key: "Ideation Mental Models", text: 'Ideation  Mental Models', color: '#cc00cc', loc: '0 0' },
        { key: "Building Narratives", text: 'Building Narratives', color: '#cc00cc', loc: '0 0' },

        { key: "Full Stack Proficiency", text: 'Full Stack Proficiency', color: '#ff9933', loc: '0 0' },

        { key: "Logic", text: 'Logic', color: '#ff9933', loc: '0 0' },
        { key: "Functional", text: 'Functional', color: '#ff9933', loc: '0 0' },
        { key: "Imperative", text: 'Imperative', color: '#ff9933', loc: '0 0' },

        { key: "Distributed Systems Foundations", text: 'Distributed Systems Foundations', color: '#8000ff', loc: '0 0' },
        { key: "Application Design Patterns", text: 'Application Design Patterns', color: '#8000ff', loc: '0 0' },

        { key: "Gang of Four", text: 'Gang of Four', color: '#e60073', loc: '0 0' },

        { key: "CAP Theorem", text: 'CAP Theorem', color: '#e60073', loc: '0 0' },
        { key: "Caching", text: 'Caching', color: '#e60073', loc: '0 0' },
        { key: "Load Balancers", text: 'Load Balancers', color: '#e60073', loc: '0 0' },
        { key: "Hashing", text: 'Hashing', color: '#e60073', loc: '0 0' },
        { key: "Replication & Sharding", text: 'Replication & Sharding', color: '#e60073', loc: '0 0' },
        { key: "Leader Election", text: 'Leader Electionm', color: '#e60073', loc: '0 0' },
        { key: "Polling & Streaming", text: 'Polling & Streaming', color: '#e60073', loc: '0 0' },
        { key: "Rate Limiting", text: "Rate Limiting", color: '#e60073', loc: '0 0' },
        { key: "PubSub", text: 'PubSub', color: '#e60073', loc: '0 0' },
        { key: "Relational Databases", text: 'Relational Databases', color: '#e60073', loc: '0 0' },
        { key: "Key Value Stores", text: 'Key Value Stores', color: '#e60073', loc: '0 0' },
        { key: "Peer to Peer Networking", text: 'Peer to Peer Networking', color: '#e60073', loc: '0 0' },
        { key: "Map Reduce", text: "Map Reduce", color: '#e60073', loc: '0 0' },

        { key: "Strangler", text: "Strangler", color: '#1a8cff', loc: '0 0' },
        { key: "Bulkhead", text: "Bulkhead", color: '#1a8cff', loc: '0 0' },
        { key: "Circuit Breaker", text: "Circuit Breaker", color: '#1a8cff', loc: '0 0' },
        { key: "CQRS", text: "CQRS", color: '#1a8cff', loc: '0 0' },
        { key: "Event Sourcing", text: "Event Sourcing", color: '#1a8cff', loc: '0 0' },
        { key: "Service Mesh", text: "Service Mesh", color: '#1a8cff', loc: '0 0' },
        { key: "Saga", text: "Saga", color: '#1a8cff', loc: '0 0' },
        { key: "Anti-Corruption Layer", text: "Anti-Corruption Layer", color: '#1a8cff', loc: '0 0' },

        { key: "Arrays", text: "Arrays", color: '#009900', loc: '0 0' },
        { key: "Lists", text: "Lists", color: '#009900', loc: '0 0' },
        { key: "Maps", text: "Maps", color: '#009900', loc: '0 0' },
        { key: "Stacks & Queues", text: "Stacks & Queues", color: '#009900', loc: '0 0' },
        { key: "Trees", text: "Trees", color: '#009900', loc: '0 0' },
        { key: "Graphs", text: "Graphs", color: '#009900', loc: '0 0' },
       
        { key: "Dynamic Programming", text: "Dynamic Programming", color: '#0099ff', loc: '0 0' },
        { key: "Sorting", text: "Sorting", color: '#0099ff', loc: '0 0' },
        { key: "Searching", text: "Searching", color: '#0099ff', loc: '0 0' },
        { key: "DFS, BFS", text: "DFS, BFS", color: '#0099ff', loc: '0 0' },
        { key: "Greedy", text: "Greedy", color: '#0099ff', loc: '0 0' },
        { key: "Two Pointers", text: "Two Pointers", color: '#0099ff', loc: '0 0' },
        { key: "Union Find", text: "Union Find", color: '#0099ff', loc: '0 0' },
        { key: "Backtracking", text: "Backtracking", color: '#0099ff', loc: '0 0' },

        { key: "Calculus", text: "Calculus", color: '#e600e6', loc: '0 0' },
        { key: "Graph Theory", text: "Graph Theory", color: '#e600e6', loc: '0 0' },
        { key: "Discrete Math", text: "Discrete Math", color: '#e600e6', loc: '0 0' },
        { key: "Probability", text: "Probability", color: '#e600e6', loc: '0 0' },
        { key: "Statistics", text: "Statistics", color: '#e600e6', loc: '0 0' },
        { key: "Linear Algebra", text: "Linear Algebra", color: '#e600e6', loc: '0 0' },
      ],
      linkDataArray: [
        { key: 0, from: "SUPERSTAR DEVELOPER", to: "Vision Creation" },
        { key: 1, from: "SUPERSTAR DEVELOPER", to: "Vision Execution" },
        { key: 2, from: "Vision Execution", to: "Building" },
        { key: 3, from: "Vision Execution", to: "Prototyping" },
        { key: 4, from: "Vision Execution", to: "Estimating" },
        { key: 5, from: "Vision Execution", to: "Deploying" },

        { key: 6, from: "Building", to: "Non Functional" },
        { key: 7, from: "Building", to: "Managing Complexity" },
        { key: 8, from: "Building", to: "Frameworks" },        
        { key: 9, from: "Building", to: "Programming Paradigms" },
        { key: 10, from: "Building", to: "Clean Coding Principles" },

        { key: 101, from: "Non Functional", to: "Cost" },
        { key: 102, from: "Non Functional", to: "Operational Excellence" },
        { key: 103, from: "Non Functional", to: "Operational Excellence" },
        { key: 104, from: "Non Functional", to: "Reliability" },
        { key: 105, from: "Non Functional", to: "Performance" },
        { key: 106, from: "Non Functional", to: "Security" },
        { key: 107, from: "Non Functional", to: "Sustainability" },

        { key: 202, from: "Managing Complexity", to: "Design Principles" },
        { key: 203, from: "Managing Complexity", to: "Distributed Systems Foundations" },
        { key: 204, from: "Managing Complexity", to: "Application Design Patterns" },
        { key: 205, from: "Managing Complexity", to: "Data Structures" },
        { key: 206, from: "Managing Complexity", to: "Algorithms" },
        { key: 207, from: "Managing Complexity", to: "Essential Maths" },
        { key: 208, from: "Managing Complexity", to: "Modelling" },

        { key: 211, from: "Modelling", to: "Domain Driven Design" },
        { key: 212, from: "Modelling", to: "Application Modelling" },
        { key: 213, from: "Modelling", to: "Data Modelling" },
        { key: 214, from: "Modelling", to: "Decision Records" },

        { key: 231, from: "Distributed Systems Foundations", to: "CAP Theorem" },
        { key: 232, from: "Distributed Systems Foundations", to: "Caching" },
        { key: 233, from: "Distributed Systems Foundations", to: "Load Balancers" },
        { key: 234, from: "Distributed Systems Foundations", to: "Hashing" },
        { key: 235, from: "Distributed Systems Foundations", to: "Replication & Sharding" },
        { key: 236, from: "Distributed Systems Foundations", to: "Leader Election" },
        { key: 237, from: "Distributed Systems Foundations", to: "Polling & Streaming" },
        { key: 238, from: "Distributed Systems Foundations", to: "Rate Limiting" },
        { key: 239, from: "Distributed Systems Foundations", to: "Map Reduce" },
        { key: 240, from: "Distributed Systems Foundations", to: "PubSub" },
        { key: 241, from: "Distributed Systems Foundations", to: "Relational Databases" },
        { key: 242, from: "Distributed Systems Foundations", to: "Key Value Stores" },
        { key: 243, from: "Distributed Systems Foundations", to: "Peer to Peer Networking" },

        { key: 301, from: "Vision Creation", to: "Working Backwards" },
        { key: 302, from: "Vision Creation", to: "Stakeholder Management" },
        { key: 303, from: "Vision Creation", to: "Ideation Mental Models" },
        { key: 304, from: "Vision Creation", to: "Building Narratives" },

        { key: 305, from: "Prototyping", to: "Full Stack Proficiency" },
        { key: 306, from: "Programming Paradigms", to: "Logic" },
        { key: 307, from: "Programming Paradigms", to: "Functional" },
        { key: 308, from: "Programming Paradigms", to: "Imperative" },

        { key: 261, from: "Application Design Patterns", to: "Gang of Four" },
        { key: 262, from: "Application Design Patterns", to: "Strangler" },
        { key: 263, from: "Application Design Patterns", to: "Bulkhead" },
        { key: 264, from: "Application Design Patterns", to: "Circuit Breaker" },
        { key: 265, from: "Application Design Patterns", to: "CQRS" },
        { key: 266, from: "Application Design Patterns", to: "Event Sourcing" },
        { key: 267, from: "Application Design Patterns", to: "Service Mesh" },
        { key: 268, from: "Application Design Patterns", to: "Saga" },
        { key: 269, from: "Application Design Patterns", to: "Anti-Corruption Layer" },

        { key: 271, from: "Data Structures", to: "Arrays" },
        { key: 272, from: "Data Structures", to: "Lists" },
        { key: 273, from: "Data Structures", to: "Maps" },
        { key: 274, from: "Data Structures", to: "Stacks & Queues" },
        { key: 275, from: "Data Structures", to: "Trees" },
        { key: 276, from: "Data Structures", to: "Graphs" },

        { key: 281, from: "Algorithms", to: "Dynamic Programming" },
        { key: 282, from: "Algorithms", to: "Sorting" },
        { key: 283, from: "Algorithms", to: "Searching" },
        { key: 284, from: "Algorithms", to: "DFS, BFS" },
        { key: 285, from: "Algorithms", to: "Greedy" },
        { key: 286, from: "Algorithms", to: "Two Pointers" },
        { key: 287, from: "Algorithms", to: "Union Find" },
        { key: 288, from: "Algorithms", to: "Backtracking" },

        { key: 291, from: "Essential Maths", to: "Calculus" },
        { key: 292, from: "Essential Maths", to: "Graph Theory" },
        { key: 293, from: "Essential Maths", to: "Discrete Math" },
        { key: 294, from: "Essential Maths", to: "Probability" },
        { key: 295, from: "Essential Maths", to: "Statistics" },
        { key: 296, from: "Essential Maths", to: "Linear Algebra" },
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
          PaperProps={{ style: { width: "50%" } }}
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
