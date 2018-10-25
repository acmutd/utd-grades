import React from 'react';
import classes from './styles.scss';
import { Card } from 'antd';
import classNames from 'classnames';
import { SlideUp } from 'components/Animations';

const dummyItem = classNames(
  classes.card,
  classes.dummy
);

export default class SectionCard extends React.Component {
  handleClick = (e) => {
    e.preventDefault();

    this.props.history.push(`/app/section/${this.props.section.id}`);
  };
  render() {
    const { section, dummy, backgroundColor } = this.props;

    if (dummy) {
      return (
        <div className={dummyItem}></div>
      );
    }

    return (
      <SlideUp {...this.props} startAt={100}>
        <div className={classes.card} style={{ backgroundColor }} onClick={this.handleClick}>
          <p className={classes.name}>{section.course.prefix} {section.course.number}.{section.number}</p>
          <p className={classes.professor}>{section.professor.firstName} {section.professor.lastName}</p>
        </div>
      </SlideUp>
    );
  }
}