import React from 'react';
import {
  View,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
} from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';

interface Props {
  title: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

const Section: React.FC<Props> = ({ title, onPress, children }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <RNText
          style={[
            styles.title,
            { color: theme.colors.onSurface },
          ]}
        >
          {title}
        </RNText>
        {onPress && (
          <IconButton
            icon="chevron-right"
            onPress={onPress}
            size={24}
            containerColor="transparent"
            iconColor={theme.colors.onSurface}
          />
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Section;