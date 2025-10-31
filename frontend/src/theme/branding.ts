/**
 * Holy Cross Convent School - Brand Signature Colors
 * Based on official logo symbolism:
 * - Blue: God's presence and spirit
 * - Gold: God's gifts and graces
 * - Red: Centered in salvation (cross)
 * - Green: Earth and universal mission
 */

export const holyCrossBrand = {
  // Primary Signatures
  signatureBlue: '#1a237e',
  signatureGold: '#ffd700',
  signatureRed: '#d32f2f',
  
  // Accent Signatures
  accentGreen: '#2e7d32',
  accentLightBlue: '#1976d2',
  accentGoldenYellow: '#ffca28',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 50%, #ffd700 100%)',
  headerGradient: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)',
  accentGradient: 'linear-gradient(135deg, #ffd700 0%, #ffca28 50%, #d32f2f 100%)',
  fullGradient: 'linear-gradient(135deg, #1a237e 0%, #3949ab 25%, #d32f2f 50%, #ffd700 75%, #ffca28 100%)',
  
  // Semantic Signatures
  compassionateRed: 'rgba(211, 47, 47, 0.1)',
  wisdomGold: 'rgba(255, 215, 0, 0.15)',
  faithNavy: 'rgba(26, 35, 126, 0.9)',
  
  // Text Shadows for readability
  textShadowLight: '2px 2px 4px rgba(0,0,0,0.3)',
  textShadowMedium: '3px 3px 6px rgba(0,0,0,0.5)',
  textShadowHeavy: '4px 4px 8px rgba(0,0,0,0.9)',
  
  // Button Styles
  buttonStyles: {
    primary: {
      background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 50%, #ffd700 100%)',
      color: '#ffffff',
      hoverTransform: 'scale(1.05)',
      hoverBoxShadow: '0 12px 35px rgba(255, 215, 0, 0.5)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
      color: '#ffd700',
      hoverTransform: 'translateY(-3px)',
      hoverBoxShadow: '0 8px 30px rgba(255, 255, 255, 0.2)'
    },
    outline: {
      border: '2px solid #ffd700',
      color: '#ffffff',
      hoverBackground: 'rgba(255, 255, 255, 0.1)',
      hoverBorder: '#ffd700',
      hoverColor: '#ffd700'
    }
  }
};

export const pillarColors = {
  academic: '#1a237e',
  robotics: '#ff9800',
  sport: '#4caf50',
  cultural: '#9c27b0',
  serviceEthos: '#d32f2f'
};

