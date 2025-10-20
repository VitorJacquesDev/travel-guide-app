import { navigationUtils } from '../navigationUtils';

// Mock navigation object
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
};

describe('navigationUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('navigateToPointDetails', () => {
    it('should navigate to PointDetails with correct pointId', () => {
      const pointId = 'test-point-123';
      
      navigationUtils.navigateToPointDetails(mockNavigation as any, pointId);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('PointDetails', { pointId });
    });
  });

  describe('navigateToMain', () => {
    it('should navigate to Main with Home screen', () => {
      navigationUtils.navigateToMain(mockNavigation as any);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main', { screen: 'Home' });
    });
  });

  describe('navigateToAuth', () => {
    it('should navigate to Auth with Login screen', () => {
      navigationUtils.navigateToAuth(mockNavigation as any);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Auth', { screen: 'Login' });
    });
  });

  describe('navigateToTab', () => {
    it('should navigate to specific tab', () => {
      navigationUtils.navigateToTab(mockNavigation as any, 'Search');
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Main', { screen: 'Search' });
    });
  });

  describe('navigateToAuthScreen', () => {
    it('should navigate to specific auth screen', () => {
      navigationUtils.navigateToAuthScreen(mockNavigation as any, 'SignUp');
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Auth', { screen: 'SignUp' });
    });
  });
});