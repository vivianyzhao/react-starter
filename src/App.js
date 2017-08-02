import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Table, { Column } from './Table';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import createBrowserHistory from 'history/createBrowserHistory'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title: 'My First React App',
        allowSpecial: true
    };
  }

  getTitle(event) {
    var val = event.target.value;
    if (!this.state.allowSpecial) {
      val = val.replace(/[^0-9a-zA-Z ]/g, '');
    }
    this.setState({
      title: val
    });
  }

  toggleSpecial(event) {
    var val = event.target.checked;
    this.setState({
      allowSpecial: val
    }, () => {
      var val = this.childTitle.textInput.value;
      if (!this.state.allowSpecial) {
        val = val.replace(/[^0-9a-zA-Z ]/g, '');
      }
      this.setState({
        title: val
      });
      this.childTitle.textInput.focus();
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{this.state.title}</h2>
        </div>
        <MyForm title={this.state.title} changeTitle={this.getTitle.bind(this)} 
          allowSpecial={this.state.allowSpecial} 
          toggleSpecial={this.toggleSpecial.bind(this)}
          ref={(ip) => this.childTitle = ip} />
        <NavBar>
          <NavItem path="/" component={App}>Get Started</NavItem>
          <NavItem path="/table" component={App}>Table</NavItem>
          <NavItem path="/test" component={App}>Demo Form</NavItem>
        </NavBar>
      </div>
    );
  }
}
class NavBar extends Component {
  addQuery() {
    var text = prompt("enter query text");
  }

  render() {
    const customHistory = createBrowserHistory();
    return (
      <Router history={customHistory}>
        <div>
        <nav>
          <ul className="navbar">
            {this.props.children.map((navItem, i) => {
              return (
                <li key={i}><NavLink exact to={navItem.props.path} 
                  activeClassName="active"
                  activeStyle={{
    color: '#2e00ff'
   }}>{navItem.props.children}</NavLink></li>
              );
            })}
          </ul>
        </nav>
        <hr />
        <div id="main">
        <Route exact path="/" render={() => (
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>)} />
        <Route path="/table" render={() => (
          <div>
            <Table data={[{a: 1, b: 2, c: 3}, {a: 4, b: 6, c: 1}]}>
              <Column colname="a">A</Column>
              <Column colname="b">B</Column>
              <Column colname="c">C</Column>
            </Table>
          </div>
          )} />
        <Route path="/test" render={() => (
          <div>
            <h1>Test</h1>
            <QueryContainer queries={[{queryContent: 'test'},{queryContent: 'another test'}]}/>
        <ContextMenuTrigger id="some_unique_identifier">
        {/* Put the input inside <ContextMenuTrigger /> */}
        <MyCalc className="has-menu" field2={
          [{key:1,desc:'One'},{key:2,desc:'Two'},
            {key:3,desc:'Three'},{key:4,desc:'Four'},{key:5,desc:'Five'}
          ]
        } />
        </ContextMenuTrigger>
        <ContextMenu id="some_unique_identifier" className="contextMenu">
        <MenuItem data={{id: "some_data"}} onClick={this.addQuery.bind(this)}>
          Add query
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{id: "some_data"}} onClick={this.handleClick} disabled={true}>
          Help
        </MenuItem>
      </ContextMenu>

        </div>
        )} />
        </div>
        </div>
      </Router>
    );
  }
}
class NavItem extends Component {
  render() {
    return '';
  }
}

class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {enabled: true};
    this.toggleInput = this.toggleInput.bind(this);
  }

  toggleInput() {
    this.setState({
      enabled: !this.state.enabled
    }, () => {
      this.textInput.focus();
    });
  }

  render() {
    return (
      <div className="form">
        <label>
          <input type="checkbox" defaultChecked={true} 
            onChange={this.toggleInput} />
          Enable change
        </label>
        <br />
        <label>
          <input type="checkbox" defaultChecked={this.props.allowSpecial} 
            onChange={this.props.toggleSpecial} />
          Allow special characters
        </label>
        <br />
        <label>
          Set Your Header Here: &nbsp;
          <input name="text" ref={input => this.textInput = input} 
            defaultValue={this.props.title} disabled={!this.state.enabled} 
            onChange={this.props.changeTitle} />
        </label>
      </div>
    );
  }
}

class MyCalc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      f1: undefined,
      f2: undefined,
      result: ''
    };
    this.calc1 = this.calc1.bind(this);
    this.calc2 = this.calc2.bind(this);
  }

  calc1(event) {
    var val1 = event.target.value,
        result = val1 * this.state.f2;
    this.setState((prevState, props) => {
      return {
        f1: val1,
        result: isNaN(result) ? '' : result
      };
    })
  }

  calc2(event) {
    var val2 = event.target.value,
        result = val2 * this.state.f1;
    this.setState((prevState, props) => {
      return {
        f2: val2,
        result: isNaN(result) ? '' : result
      };
    })
  }

  render() {
    return (
      <div className={this.props.className}>
        <h4>Calculate field1 * field2 (try right click!)</h4>
        <label>
          field1: &nbsp;
          <input onChange={this.calc1} />
        </label>
        &nbsp; * 
        <label>
          &nbsp; field2: &nbsp;
          {this.props.field2.map((val, index) => (
             <label key={index}>
              <input type="radio" name="field2" value={val.key} onClick={this.calc2} />
              {val.desc}
            </label>
          ))}
        </label>
         = 
        <input value={this.state.result} readOnly />
      </div>
    );
  }
}

class QueryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {queries: this.props.queries}
  }

  addQuery(content) {
    this.setState((prevState, props) => {
      var queries = prevState.queries;
      queries.push({queryContent: content});
      return {queries: queries}
    });
  }

  render() {
    return (
      <div id="query-container" className="query-container">
        <ol>
          {this.state.queries.map(function(el, i) {
            return (
              <Query key={i} queryContent={el.queryContent} />
            );
          })}
        </ol>
        <button onClick={this.addQuery.bind(this, "Something")}> Add </button>
      </div>
    );
  }
}

class Query extends Component {
  render() {
    return (
      <li className="query-body">
      {this.props.queryContent}
      </li>
    );
  }
}

// class ContextMenu extends Component {
//     state = {
//         target: null,
//         visible: false,
//     };
    
//     componentDidMount() {
//         this.props.target.addEventListener('contextmenu', this._handleContextMenu);
//         this.props.target.addEventListener('click', this._handleClick);
//         this.props.target.addEventListener('scroll', this._handleScroll);
//     };

//     componentWillUnmount() {
//       this.props.target.removeEventListener('contextmenu', this._handleContextMenu);
//       this.props.target.removeEventListener('click', this._handleClick);
//       this.props.target.removeEventListener('scroll', this._handleScroll);
//     }
    
//     _handleContextMenu = (event) => {
//         event.preventDefault();
        
//         // this.setState({ visible: true });
        
//         const clickX = event.clientX;
//         const clickY = event.clientY;
//         const screenW = window.innerWidth;
//         const screenH = window.innerHeight;
//         const rootW = this.root.offsetWidth;
//         const rootH = this.root.offsetHeight;
        
//         const right = (screenW - clickX) > rootW;
//         const left = !right;
//         const top = (screenH - clickY) > rootH;
//         const bottom = !top;
        
//         if (right) {
//             this.root.style.left = `${clickX + 5}px`;
//         }
        
//         if (left) {
//             this.root.style.left = `${clickX - rootW - 5}px`;
//         }
        
//         if (top) {
//             this.root.style.top = `${clickY + 5}px`;
//         }
        
//         if (bottom) {
//             this.root.style.top = `${clickY - rootH - 5}px`;
//         }
//     };

//     _handleClick = (event) => {
//         const { visible } = this.props.showMenu;
//         const wasOutside = !(event.target.contains === this.root);
        
//         if (wasOutside && visible) this.setState({ visible: false, });
//     };

//     _handleScroll = () => {
//         const { visible } = this.state;
        
//         if (visible) this.setState({ visible: false, });
//     };

//     menu1 = () => {
//       alert('Menu 1');
//     }
    
//     render() {
//         const { visible } = this.state;
        
//         return(visible || null) && 
//             <div ref={ref => this.root = ref} className="contextMenu">
//                 <div className="contextMenu--option" onClick={this.menu1.bind(this)}>Menu1</div>
//                 <div className="contextMenu--option">Menu1</div>
//                 <div className="contextMenu--option">Menu3</div>
//                 <div className="contextMenu--option contextMenu--option__disabled">Menu4</div>
//                 <div className="contextMenu--option">Menu5</div>
//                 <div className="contextMenu--separator" />
//                 <div className="contextMenu--option">Help</div>
//             </div>
//     };
// }

export default App;
