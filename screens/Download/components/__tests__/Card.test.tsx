import React from 'react';
import renderer from 'react-test-renderer';

import Card from '../Card';

describe('Card test', () => {
  jest.useFakeTimers();

  it('should render default card successfully', () => {
    const tree = renderer.create(
      <Card
        imageSrc=""
        status="Downloading"
        progress={0}
        description={'Test Image'}
      />
    );

    expect(tree).toBeDefined();
  });

  it('should render pending label card successfully', () => {
    const tree = renderer.create(
      <Card
        imageSrc=""
        status="Pending"
        progress={0}
        description={'Test Image'}
      />
    );

    expect(tree).toBeDefined();
  });
});
