import React from "react";
import PropTypes from "prop-types";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

import Loading from "../UI/Loading/Loading";

const VirtualizedList = ({
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage,

  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isNextPageLoading,

  // Array of items loaded so far.
  items,

  // Callback function responsible for loading the next page of items.
  loadNextPage,
  itemSize = 50,
  // component that renders item
  ItemRenderer,
  itemRendererProps,
  // height that will be subtracted. ex: wrapper is a table and there is an extra table head that takes space.
  heightSubtract = 0,
  innerElementType = "div"
}) => {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = index => !hasNextPage || index < items.length;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={height - heightSubtract}
              itemCount={itemCount}
              itemSize={itemSize}
              onItemsRendered={onItemsRendered}
              innerElementType={innerElementType}
              ref={ref}
              width={width}
            >
              {({ index, style }) =>
                isItemLoaded(index) ? (
                  <ItemRenderer
                    item={items[index]}
                    style={style}
                    {...itemRendererProps}
                  />
                ) : (
                  <div style={style}>
                    <Loading dark={true} />
                  </div>
                )
              }
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

VirtualizedList.propTypes = {
  hasNextPage: PropTypes.bool.isRequired,
  isNextPageLoading: PropTypes.bool.isRequired,
  loadNextPage: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  itemSize: PropTypes.number,
  ItemRenderer: PropTypes.func.isRequired,
  itemRendererProps: PropTypes.object,
  heightSubtract: PropTypes.number
};

export default VirtualizedList;
