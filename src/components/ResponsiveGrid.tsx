import React, { useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { responsive, spacing } from '../theme';

interface ResponsiveGridProps {
  children: React.ReactNode[];
  minItemWidth?: number;
  gap?: number;
  style?: any;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  minItemWidth = 300,
  gap,
  style,
}) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: { window: any }) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const screenWidth = screenData.width;
  const gridGap = gap ?? responsive.getGridGap(screenWidth);
  
  // Calculate optimal number of columns based on screen width and minimum item width
  const calculateColumns = () => {
    if (Platform.OS !== 'web') {
      // For mobile, use responsive utility
      return responsive.getGridColumns(screenWidth);
    }
    
    // For web, calculate based on available space and minimum width
    const availableWidth = screenWidth - (spacing.lg * 2); // Account for container padding
    const columnsFromWidth = Math.floor(availableWidth / (minItemWidth + gridGap));
    const maxColumns = responsive.getGridColumns(screenWidth);
    
    return Math.min(Math.max(1, columnsFromWidth), maxColumns);
  };

  const columns = calculateColumns();
  const itemWidth = Platform.OS === 'web' 
    ? `${(100 / columns) - (gridGap * (columns - 1)) / columns}%`
    : (screenWidth - (spacing.lg * 2) - (gridGap * (columns - 1))) / columns;

  // Group children into rows
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < children.length; i += columns) {
    rows.push(children.slice(i, i + columns));
  }

  if (Platform.OS === 'web') {
    // Use CSS Grid for web
    return (
      <View
        style={[
          styles.webGrid,
          {
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: gridGap,
          },
          style,
        ]}
      >
        {children.map((child, index) => (
          <View key={index} style={styles.webGridItem}>
            {child}
          </View>
        ))}
      </View>
    );
  }

  // Use Flexbox for mobile
  return (
    <View style={[styles.mobileGrid, style]}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { marginBottom: rowIndex < rows.length - 1 ? gridGap : 0 }]}>
          {row.map((child, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.item,
                {
                  width: itemWidth,
                  marginRight: colIndex < row.length - 1 ? gridGap : 0,
                },
              ]}
            >
              {child}
            </View>
          ))}
          {/* Fill empty spaces in the last row */}
          {row.length < columns && 
            Array.from({ length: columns - row.length }).map((_, emptyIndex) => (
              <View
                key={`empty-${emptyIndex}`}
                style={[
                  styles.item,
                  {
                    width: itemWidth,
                    marginRight: emptyIndex < columns - row.length - 1 ? gridGap : 0,
                  },
                ]}
              />
            ))
          }
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  webGrid: {
    display: 'grid' as any,
    width: '100%',
  },
  webGridItem: {
    width: '100%',
  },
  mobileGrid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  item: {
    flexShrink: 0,
  },
});

export default ResponsiveGrid;
