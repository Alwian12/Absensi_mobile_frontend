import React from 'react';
import Svg, {Circle, Line, Path, Rect} from 'react-native-svg';

export type IconName =
  | 'alert'
  | 'barChart'
  | 'calendar'
  | 'camera'
  | 'check'
  | 'clipboard'
  | 'file'
  | 'home'
  | 'logIn'
  | 'logOut'
  | 'mapPin'
  | 'paperclip'
  | 'send'
  | 'shield'
  | 'user'
  | 'users';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export const Icon = ({
  name,
  size = 22,
  color = '#17202A',
  strokeWidth = 2,
}: IconProps) => {
  const commonProps = {
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityRole="image">
      {name === 'alert' ? (
        <>
          <Circle cx="12" cy="12" r="9" {...commonProps} />
          <Line x1="12" y1="8" x2="12" y2="12" {...commonProps} />
          <Line x1="12" y1="16" x2="12.01" y2="16" {...commonProps} />
        </>
      ) : null}
      {name === 'barChart' ? (
        <>
          <Line x1="4" y1="20" x2="20" y2="20" {...commonProps} />
          <Rect x="6" y="11" width="3.5" height="6" rx="1" {...commonProps} />
          <Rect x="10.75" y="7" width="3.5" height="10" rx="1" {...commonProps} />
          <Rect x="15.5" y="4" width="3.5" height="13" rx="1" {...commonProps} />
        </>
      ) : null}
      {name === 'calendar' ? (
        <>
          <Rect x="4" y="5" width="16" height="15" rx="2" {...commonProps} />
          <Line x1="8" y1="3" x2="8" y2="7" {...commonProps} />
          <Line x1="16" y1="3" x2="16" y2="7" {...commonProps} />
          <Line x1="4" y1="10" x2="20" y2="10" {...commonProps} />
        </>
      ) : null}
      {name === 'camera' ? (
        <>
          <Path d="M8 7l1.6-2h4.8L16 7h2.5A2.5 2.5 0 0121 9.5v7A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-7A2.5 2.5 0 015.5 7H8z" {...commonProps} />
          <Circle cx="12" cy="13" r="3.4" {...commonProps} />
        </>
      ) : null}
      {name === 'check' ? (
        <>
          <Circle cx="12" cy="12" r="9" {...commonProps} />
          <Path d="M8 12l2.5 2.5L16.5 9" {...commonProps} />
        </>
      ) : null}
      {name === 'clipboard' ? (
        <>
          <Rect x="6" y="5" width="12" height="16" rx="2" {...commonProps} />
          <Path d="M9 5a3 3 0 006 0" {...commonProps} />
          <Path d="M9 10h6M9 14h6M9 18h3" {...commonProps} />
        </>
      ) : null}
      {name === 'file' ? (
        <>
          <Path d="M6 3h8l4 4v14H6z" {...commonProps} />
          <Path d="M14 3v5h5" {...commonProps} />
          <Path d="M9 13h6M9 17h4" {...commonProps} />
        </>
      ) : null}
      {name === 'home' ? (
        <>
          <Path d="M4 11.5L12 4l8 7.5" {...commonProps} />
          <Path d="M6.5 10.5V20h11v-9.5" {...commonProps} />
          <Path d="M10 20v-5h4v5" {...commonProps} />
        </>
      ) : null}
      {name === 'logIn' ? (
        <>
          <Path d="M10 17l5-5-5-5" {...commonProps} />
          <Line x1="15" y1="12" x2="3" y2="12" {...commonProps} />
          <Path d="M14 4h4a3 3 0 013 3v10a3 3 0 01-3 3h-4" {...commonProps} />
        </>
      ) : null}
      {name === 'logOut' ? (
        <>
          <Path d="M14 17l5-5-5-5" {...commonProps} />
          <Line x1="19" y1="12" x2="8" y2="12" {...commonProps} />
          <Path d="M10 20H6a3 3 0 01-3-3V7a3 3 0 013-3h4" {...commonProps} />
        </>
      ) : null}
      {name === 'mapPin' ? (
        <>
          <Path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1114 0z" {...commonProps} />
          <Circle cx="12" cy="10" r="2.4" {...commonProps} />
        </>
      ) : null}
      {name === 'paperclip' ? (
        <Path d="M8 12.5l6.2-6.2a3.2 3.2 0 014.5 4.5l-7.5 7.5a5 5 0 01-7.1-7.1l7.2-7.2" {...commonProps} />
      ) : null}
      {name === 'send' ? (
        <>
          <Path d="M21 3L10 14" {...commonProps} />
          <Path d="M21 3l-7 18-4-7-7-4 18-7z" {...commonProps} />
        </>
      ) : null}
      {name === 'shield' ? (
        <>
          <Path d="M12 3l7 3v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3z" {...commonProps} />
          <Path d="M9 12l2 2 4-4" {...commonProps} />
        </>
      ) : null}
      {name === 'user' ? (
        <>
          <Circle cx="12" cy="8" r="4" {...commonProps} />
          <Path d="M4.5 21a7.5 7.5 0 0115 0" {...commonProps} />
        </>
      ) : null}
      {name === 'users' ? (
        <>
          <Circle cx="9" cy="8" r="3.5" {...commonProps} />
          <Path d="M2.8 20a6.2 6.2 0 0112.4 0" {...commonProps} />
          <Path d="M16 11a3 3 0 100-6" {...commonProps} />
          <Path d="M17.5 15.5A5 5 0 0121.2 20" {...commonProps} />
        </>
      ) : null}
    </Svg>
  );
};
