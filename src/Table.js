import React, { Component } from 'react';

export default class Table extends Component {
  render() {
    var style = {
      width: "100%",
      marginTop: "2rem"
    },
      colmap = [];
    this.props.children.forEach((header) => {
      colmap.push(header.props.colname);
    });
    return (
      <div>
      <table style={style}>
        <caption>This is a <b>DEMO</b> table</caption>
        <thead><tr>
        {this.props.children}
        </tr></thead>
        <tbody>
        {this.props.data.map((row, i) => {
          return (
            <tr key={i}>
              {colmap.map((colname, j) => {
                return <td key={[i,j]}>{row[colname]}</td>
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
      </div>
    )
  }
}

export class Column extends Component {
  render() {
    return <th>{this.props.children}</th>
  }
}