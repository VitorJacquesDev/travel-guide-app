import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// Test component that uses the theme
const TestComponent = () => {
    const { theme, themeMode, toggleTheme } = useTheme();

    return (
        <>
            <Text testID="theme-mode">{themeMode}</Text>
            <Text testID="is-dark">{theme.isDark.toString()}</Text>
            <Text testID="primary-color">{theme.colors.primary}</Text>
        </>
    );
};

describe('ThemeProvider', () => {
    it('should provide theme context to children', () => {
        const { getByTestId } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(getByTestId('theme-mode')).toBeTruthy();
        expect(getByTestId('is-dark')).toBeTruthy();
        expect(getByTestId('primary-color')).toBeTruthy();
    });

    it('should throw error when useTheme is used outside provider', () => {
        // Mock console.error to avoid noise in test output
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useTheme must be used within a ThemeProvider');

        consoleSpy.mockRestore();
    });

    it('should start with system theme mode by default', () => {
        const { getByTestId } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(getByTestId('theme-mode').props.children).toBe('system');
    });
});