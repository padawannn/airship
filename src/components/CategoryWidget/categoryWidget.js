import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';
import { colors } from '../../constants';
import { readableNumber } from '../../utils';
import Base from '../Typography/base';

const CATEGORY_OTHER = 'Other';

const Categories = styled.ul`
  padding: 0;
  list-style: none;
`;

const Amount = Base.withComponent('span').extend`
  flex: 30%;
  text-align: right;
  font-size: 12px;
  line-height: 20px;
`;

const Name = Base.withComponent('p').extend`
  flex: 70%;
  font-size: 12px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
`;

const Progress = styled.div`
  height: 4px;
  width: 100%;
  border-radius: 2px;
  background: ${colors.ui02};
  position: relative;

  &::after {
    content: '';
    width: ${props => props.amount}%;
    height: 4px;
    border-radius: 2px;
    transition: background 0.2s ease;
    position: absolute;
    max-width: 100%;
    left: 0;
  }
`;

const Category = styled.li`
  display: flex;
  flex-wrap: wrap;
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};
  margin-bottom: 8px;

  & > ${Progress}::after {
    background: ${props => (props.isOther ? colors.type01 : props.color)};
  }

  ${props => props.clickable && css`
    &:hover {
      & > ${Progress}::after {
        background: ${props => (props.isOther ? lighten(0.4, colors.type01) : darken(0.16, props.color))};
      }
    }
  `};

  ${props => !props.selected && css`
    ${Amount},
    ${Name} {
      color: ${colors.type02};
    }

    ${Progress}::after {
      background: ${colors.ui03};
    }

    &:hover {
      & > ${Progress}::after {
        background: ${colors.ui04}
      }
    }
  `}
`;

Category.displayName = 'Category';

class CategoryWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected || [],
    };
  }

  onCategoryClick = categoryName => {
    if (!this.props.onCategoryClick) return;

    const { selected } = this.state;

    const nextSelected = this.isSelected(categoryName)
      ? selected.filter(category => category !== categoryName)
      : [...selected, categoryName];

    this.setState({ selected: nextSelected });

    this.props.onCategoryClick(nextSelected);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => ({ selected: nextProps.selected || prevState.selected }));
  }

  isSelected(name) {
    return this.state.selected.includes(name);
  }

  render() {
    const { color, categories, max, onCategoryClick } = this.props;

    return (
      <Categories>
        {categories.map(category => {
          const { name, value } = category;
          const selected = this.state.selected.length === 0 || this.isSelected(name);

          return (
            <Category
              key={name}
              clickable={!!onCategoryClick}
              onClick={() => this.onCategoryClick(name)}
              selected={selected}
              isOther={name === CATEGORY_OTHER}
              color={color}
            >
              <Name>{name}</Name>
              <Amount>{readableNumber(value)}</Amount>
              <Progress amount={(value / max) * 100} />
            </Category>
          );
        })}
      </Categories>
    );
  }
}

CategoryWidget.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
  color: PropTypes.string,
  max: PropTypes.number,
  onCategoryClick: PropTypes.func,
  selected: PropTypes.array,
};

CategoryWidget.defaultProps = {
  color: colors.brand03,
  categories: [],
  selected: [],
};

export default CategoryWidget;
