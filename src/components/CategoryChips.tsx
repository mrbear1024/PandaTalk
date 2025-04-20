import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryChips: React.FC<Props> = ({ categories, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map(cat => (
        <Chip
          key={cat}
          icon={selected === cat ? 'check' : undefined}
          selected={selected === cat}
          onPress={() => onSelect(cat)}
          style={{
            ...styles.chip,
            backgroundColor:
              selected === cat
                ? theme.colors.primary
                : theme.colors.surfaceVariant,
          }}
          textStyle={{
            color:
              selected === cat
                ? theme.colors.onPrimary
                : theme.colors.onSurfaceVariant,
          }}
        >
          {cat}
        </Chip>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 8,
  },
});

export default CategoryChips;