# 🎨 Modern UI Upgrade Guide

## Overview

Aplikasi Absensi Mobile Frontend telah diupgrade dengan design system modern yang mencakup:
- ✨ Vibrant color palette dengan gradients
- 🎬 Smooth animations menggunakan Moti
- 🎭 Glassmorphism effects
- 📐 Enhanced spacing & typography system
- ⚡ Modern form controls dengan variants

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 2. Install New Gradient Library

```bash
npm install react-native-linear-gradient
# atau
yarn add react-native-linear-gradient
```

### 3. Rebuild untuk Android/iOS

```bash
# Android
npm run android

# iOS
npm run ios
```

---

## 🎨 Modern Color Palette

### Primary Colors
- **Brand (Teal)**: `#06B6D4` - Main action color
- **Brand Dark**: `#0891B2` - Darker variant
- **Brand Light**: `#A5F3FC` - Lighter variant
- **Brand Soft**: `#E0F2FE` - Background variant

### Accent Colors
- **Accent (Pink)**: `#EC4899` - Secondary action
- **Accent Dark**: `#BE185D` - Darker variant
- **Accent Light**: `#F472B6` - Lighter variant
- **Accent Soft**: `#FCE7F3` - Background variant

### Status Colors
- **Green**: `#10B981` - Hadir/Success
- **Amber**: `#F59E0B` - Terlambat/Warning
- **Blue**: `#3B82F6` - Izin/Info
- **Red**: `#EF4444` - Alpa/Error
- **Purple**: `#A855F7` - Additional

### Grayscale
- **Ink**: `#0F172A` - Text primary
- **Muted**: `#64748B` - Text secondary
- **Faint**: `#94A3B8` - Text tertiary
- **Soft**: `#F8FAFC` - Background light
- **Surface**: `#FFFFFF` - Card background
- **Graphite**: `#1E293B` - Header background

---

## 🎬 Component Usage Guide

### 1. Buttons

#### Basic Button
```tsx
import { Button } from '../components/FormControls';

<Button
  label="Click Me"
  onPress={() => console.log('Clicked!')}
/>
```

#### Button Variants
```tsx
// Primary (default)
<Button label="Primary" onPress={() => {}} />

// Secondary
<Button label="Secondary" onPress={() => {}} variant="secondary" />

// Danger
<Button label="Delete" onPress={() => {}} variant="danger" />

// Ghost (transparent)
<Button label="Ghost" onPress={() => {}} variant="ghost" />

// Outline
<Button label="Outline" onPress={() => {}} variant="outline" />
```

#### Button Sizes
```tsx
<Button label="Small" onPress={() => {}} size="sm" />
<Button label="Medium" onPress={() => {}} size="md" />
<Button label="Large" onPress={() => {}} size="lg" />
```

#### Button with Icon
```tsx
<Button 
  label="Login" 
  onPress={() => {}} 
  icon="logIn"
/>
```

#### Loading State
```tsx
<Button 
  label="Processing..." 
  onPress={() => {}} 
  loading={true}
/>
```

---

### 2. Form Fields

#### Basic Field
```tsx
import { Field } from '../components/FormControls';

<Field
  placeholder="Enter text..."
  value={text}
  onChangeText={setText}
/>
```

#### Field dengan Label & Error
```tsx
<Field
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>
```

#### Field dengan Icon
```tsx
<Field
  label="Username"
  placeholder="Enter username"
  icon="user"
  value={username}
  onChangeText={setUsername}
/>
```

#### Glassmorphic Field
```tsx
<Field
  label="Password"
  placeholder="Enter password"
  icon="shield"
  variant="glass"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>
```

---

### 3. Badges

#### Attendance Badge (Status Kehadiran)
```tsx
import { AttendanceBadge } from '../components/Badge';

// Default variant
<AttendanceBadge status="hadir" />

// Compact variant
<AttendanceBadge status="terlambat" variant="compact" />

// Large variant
<AttendanceBadge status="izin" variant="large" />

// Without animation
<AttendanceBadge status="alpa" animated={false} />
```

**Status Options**: `'hadir' | 'terlambat' | 'izin' | 'alpa'`

#### Request Badge (Status Pengajuan)
```tsx
import { RequestBadge } from '../components/Badge';

<RequestBadge status="menunggu" />
<RequestBadge status="disetujui" variant="compact" />
<RequestBadge status="ditolak" variant="large" />
```

**Status Options**: `'menunggu' | 'disetujui' | 'ditolak'`

#### Custom Badge
```tsx
import { CustomBadge } from '../components/Badge';

<CustomBadge
  label="Custom"
  color="#EC4899"
  backgroundColor="#FCE7F3"
  variant="default"
/>
```

---

### 4. Segmented Control

```tsx
import { Segmented } from '../components/FormControls';

const [filter, setFilter] = useState('semua');
const filters = ['semua', 'hadir', 'terlambat', 'izin', 'alpa'];

<Segmented
  items={filters}
  value={filter}
  onChange={setFilter}
/>
```

#### Glassmorphic Variant
```tsx
<Segmented
  items={filters}
  value={filter}
  onChange={setFilter}
  variant="glass"
/>
```

---

### 5. Screen Components

#### Screen Wrapper
```tsx
import { Screen } from '../components/Screen';

<Screen
  title="Dashboard"
  subtitle="Monday, June 15, 2026"
  badge="Admin dan atasan"
>
  {/* Your content */}
</Screen>
```

#### Section Header
```tsx
import { SectionHeader } from '../components/Screen';

<SectionHeader
  title="Recent Activities"
  subtitle="Last 7 days"
  action="12 items"
/>
```

#### Card Components
```tsx
import { Card } from '../components/Screen';

// Default card
<Card>
  <Text>Content</Text>
</Card>

// Glassmorphic card
<Card variant="glass">
  <Text>Frosted glass effect</Text>
</Card>

// Elevated card
<Card variant="elevated">
  <Text>Elevated with strong shadow</Text>
</Card>
```

---

### 6. Gradient Components

```tsx
import { GradientOverlay, GlassCard } from '../components/Gradient';

// Gradient Overlay
<GradientOverlay variant="brand">
  {/* Content */}
</GradientOverlay>

// Glassmorphic Card
<GlassCard intensity={0.8}>
  <Text>Glassmorphic content</Text>
</GlassCard>

// Animated Gradient Background
<AnimatedGradientBg variant="soft">
  {/* Screen content */}
</AnimatedGradientBg>
```

**Gradient Variants**: `'brand' | 'accent' | 'blue' | 'purple' | 'softBrand' | 'softAccent' | 'softPurple'`

---

## 🎨 Theme System

### Importing Theme

```tsx
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
  gradients,
  glass,
} from '../components/Theme';
```

### Using Theme Values

```tsx
// Colors
const backgroundColor = colors.brand;

// Radius
const borderRadius = radius.lg; // 12

// Shadows
const shadowStyle = shadows.card;

// Spacing
const padding = spacing.lg; // 16

// Typography
const textStyle = typography.h1;
// { fontSize: 32, fontWeight: '900', lineHeight: 40 }
```

### Spacing Scale
```
xs: 4,
sm: 8,
md: 12,
lg: 16,
xl: 24,
2xl: 32,
```

### Border Radius Scale
```
xs: 4,
sm: 6,
md: 8,
lg: 12,
xl: 16,
full: 9999,
```

---

## ✨ Animation Patterns

### Using Moti for Animations

```tsx
import { MotiView } from 'moti';

// Fade-in animation
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ type: 'timing', duration: 500 }}
>
  <Text>Animated text</Text>
</MotiView>

// Slide-in animation
<MotiView
  from={{ opacity: 0, translateX: -20 }}
  animate={{ opacity: 1, translateX: 0 }}
  transition={{ type: 'timing', duration: 600 }}
>
  <Text>Sliding in</Text>
</MotiView>

// Scale animation
<MotiView
  from={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'timing', duration: 400 }}
>
  <Text>Scaling up</Text>
</MotiView>

// Loop animation
<MotiView
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
  }}
  transition={{
    type: 'timing',
    duration: 2000,
    loop: true,
  }}
>
  <Text>Pulsing</Text>
</MotiView>
```

### Staggered Animations

```tsx
// Multiple elements with delay
<MotiView
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
  transition={{ type: 'timing', duration: 600, delay: 0 }}
>
  Item 1
</MotiView>

<MotiView
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
  transition={{ type: 'timing', duration: 600, delay: 100 }}
>
  Item 2
</MotiView>

<MotiView
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
  transition={{ type: 'timing', duration: 600, delay: 200 }}
>
  Item 3
</MotiView>
```

---

## 🎭 Glassmorphism & Modern Effects

### Creating Glassmorphic Elements

```tsx
// Method 1: Using GlassCard component
<GlassCard intensity={0.8}>
  <Text>Frosted glass</Text>
</GlassCard>

// Method 2: Manual styling
<View
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    overflow: 'hidden',
  }}
>
  <Text>Custom glass effect</Text>
</View>
```

### Gradient Backgrounds

```tsx
import LinearGradient from 'react-native-linear-gradient';

<LinearGradient
  colors={['#06B6D4', '#0891B2']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ padding: 20 }}
>
  <Text style={{ color: 'white' }}>Gradient content</Text>
</LinearGradient>
```

---

## 📱 Responsive Design

### Screen Size Detection

```tsx
import { useWindowDimensions } from 'react-native';

const MyScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  
  return (
    <View style={[styles.container, isWide && styles.containerWide]}>
      {/* Responsive content */}
    </View>
  );
};
```

---

## 🚀 Best Practices

1. **Use Theme Colors**: Selalu gunakan color dari `Theme.ts` untuk konsistensi
2. **Responsive**: Gunakan `useWindowDimensions()` untuk adaptive UI
3. **Animations**: Gunakan Moti untuk smooth transitions, jangan overuse
4. **Spacing**: Gunakan `spacing` scale untuk consistent padding/margin
5. **Variants**: Manfaatkan component variants untuk flexibility
6. **Accessibility**: Test dengan screen readers dan high contrast mode

---

## 🔧 Common Issues & Solutions

### Linear Gradient not showing?
- Pastikan `react-native-linear-gradient` sudah di-install
- Rebuild app: `npm run android` / `npm run ios`

### Animations not smooth?
- Check interpolation type di Moti
- Reduce animation duration jika terlalu lambat
- Use `useWindowDimensions()` untuk responsive animations

### Glassmorphic effects transparent?
- Adjust `backgroundColor` opacity (0.7 - 0.9 recommended)
- Ensure parent has contrasting background

---

## 📚 Additional Resources

- [Moti Documentation](https://moti.fyi/)
- [React Native Linear Gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Our Theme System](./src/components/Theme.ts)

---

## 🎯 Next Steps

1. ✅ Run `npm install` untuk install dependencies baru
2. ✅ Rebuild aplikasi untuk Android/iOS
3. ✅ Test semua components di berbagai screens
4. ✅ Update existing screens dengan new components
5. ✅ Gather feedback dan iterate

---

**Happy coding! 🚀**
