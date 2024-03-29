/* eslint-disable  @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React, { ForwardRefExoticComponent } from "react";
import shapes, { componentId, getRandomShape, shapeTypes } from "../shapes";
import { ShapeType } from "../lib";
import { Coolshape, Star } from "../lib/shapes";

describe("using every icons from the defined list", async () => {
  const shapeTypes = Object.keys(shapes) as Array<shapeTypes>;
  shapeTypes.forEach((type) => {
    shapes[type].forEach((Shape, i) => {
      const iconId = `${type}-${++i}`;

      const props = {
        className: "shape",
        "data-testid": iconId,
        size: 20,
      };
      it(`${iconId} icon component renders and has default noise`, () => {
        const { getByTestId } = render(<Shape {...props} />);
        const shapeElement = getByTestId(iconId);
        expect(shapeElement).toBeDefined();
        expect(
          shapeElement.querySelector(`#cs_noise_1_${iconId}`)
        ).toBeTruthy();
      });
      it(`Component is accepting custom class name and sizes `, () => {
        const { getByTestId } = render(<Shape {...props} />);
        const shapeElement = getByTestId(iconId);

        expect(shapeElement.classList.contains(props.className)).toBeTruthy();
        expect(shapeElement.getAttribute("width")).toBe(props.size.toString());
        expect(shapeElement.getAttribute("height")).toBe(props.size.toString());
      });
    });
  });
});

describe("using random shape function", () => {
  it("it should return a random shape component", () => {
    const randomShape = getRandomShape() as ForwardRefExoticComponent<any>;
    expect(randomShape.displayName).toBeTruthy();
    expect(
      Object.keys(shapes).some((element) =>
        randomShape.displayName?.toLowerCase().startsWith(element)
      )
    ).toBeTruthy();
  });

  it("Should return a random shape identifier", () => {
    const randomShape = getRandomShape({ onlyId: true }) as componentId;
    expect(shapes[randomShape.shapeType][randomShape.index]).toBeDefined();
  });
  it("Should return a random shape of same type", () => {
    const randomShape = getRandomShape({ type: "ellipse" }) as ShapeType;
    expect(randomShape.displayName).toBeTruthy();
    expect(randomShape.displayName?.toLowerCase()).toMatch("ellipse");
  });
});

describe("using the component for a shape type", () => {
  const props = {
    className: "customName",
    size: 20,
    noise: true,
  };
  it("it should render a valid random component with given information", () => {
    const testID = "component";
    const { getByTestId } = render(<Star data-testid={testID} {...props} />);
    const ShapeComponent = getByTestId(testID);
    expect(ShapeComponent).toBeDefined();
    expect(ShapeComponent.classList).toContain("coolshape");
    expect(ShapeComponent.getAttribute("width")).toBe(props.size.toString());
  });
  it("it should render a exact given component with index", () => {
    const testID = "component";
    const { getByTestId } = render(
      <Star data-testid={testID} {...props} index={1} />
    );
    const ShapeComponent = getByTestId(testID);
    expect(ShapeComponent).toBeDefined();
    expect(ShapeComponent.classList).toContain("coolshape");
    expect(ShapeComponent.classList).toContain("star-1");
  });
});

describe("Using coolshape component with noise prop", () => {
  const { index, shapeType } = getRandomShape({ onlyId: true }) as componentId;
  const props = {
    className: "custom",
    size: 20,
    index,
    type: shapeType,
  };
  it("If noise is set to true, the noise should be visible ", () => {
    const testID = "coolshape";
    const { getByTestId } = render(
      <Coolshape data-testid={testID} {...props} noise={true} />
    );

    const ShapeComponent = getByTestId(testID);
    expect(ShapeComponent).toBeDefined();
    expect(
      ShapeComponent.querySelector(`#cs_noise_1_${shapeType + "-" + index}`)
    ).toBeTruthy();
  });
  it("If noise is set to false, the noise should not be visible ", () => {
    const testID = "coolshape";
    const { getByTestId } = render(
      <Coolshape data-testid={testID} {...props} noise={false} />
    );
    const ShapeComponent = getByTestId(testID);
    expect(ShapeComponent).toBeDefined();
    expect(ShapeComponent.classList).toContain("coolshape");
    expect(
      ShapeComponent.querySelector(`#cs_noise_1_${shapeType + "-" + index}`)
    ).toBeFalsy();
  });
});
