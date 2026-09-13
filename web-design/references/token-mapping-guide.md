# Cross-Platform Token Mapping Guide

Mapping design tokens across Web, Tailwind, Flutter, SwiftUI, and Jetpack Compose.

---

## 1. Token Cross-Platform Matrix

| Semantic Token | Web CSS Variable | Tailwind CSS | Flutter (ThemeData) | SwiftUI (iOS) | Jetpack Compose (Android) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `--primary: #18181b` | `bg-primary / text-primary` | `colorScheme.primary` | `Color("Primary")` | `MaterialTheme.colorScheme.primary` |
| **Primary Hover** | `--primary-hover: #27272a`| `hover:bg-zinc-800` | `hoverColor: Color(0xFF27272A)`| Custom ButtonStyle | `ButtonDefaults.buttonColors()` |
| **Secondary** | `--secondary: #f4f4f5` | `bg-secondary` | `colorScheme.secondary` | `Color("Secondary")` | `MaterialTheme.colorScheme.secondary` |
| **Success** | `--success: #16a34a` | `bg-emerald-600` | `Color(0xFF16A34A)` | `Color("Success")` | `CustomStatusColor.Success` |
| **Warning** | `--warning: #f59e0b` | `bg-amber-500` | `Color(0xFFF59E0B)` | `Color("Warning")` | `CustomStatusColor.Warning` |
| **Error / Danger** | `--destructive: #ef4444` | `bg-destructive` | `colorScheme.error` | `Color("Destructive")` | `MaterialTheme.colorScheme.error` |
| **Background** | `--background: #ffffff` | `bg-background` | `scaffoldBackgroundColor` | `Color(uiColor: .systemBackground)` | `colorScheme.background` |
| **Card Surface** | `--card: #ffffff` | `bg-card` | `cardColor: Colors.white` | `Color.white` | `colorScheme.surface` |
| **Text** | `--foreground: #09090b` | `text-foreground` | `textTheme.bodyMedium.color` | `Color.primary` | `colorScheme.onSurface` |
| **Muted Text** | `--muted-foreground: #71717a`| `text-muted-foreground` | `textTheme.bodySmall.color` | `Color.secondary` | `colorScheme.onSurfaceVariant` |
| **Border** | `--border: #e4e4e7` | `border-border` | `dividerColor: Color(0xFFE4E4E7)` | `Color(uiColor: .separator)` | `colorScheme.outline` |
| **Base Radius** | `--radius: 6px` | `rounded-md` (0.375rem) | `BorderRadius.circular(6.0)` | `.cornerRadius(6.0)` | `RoundedCornerShape(6.dp)` |
| **Large Radius** | `--radius-lg: 12px` | `rounded-xl` (0.75rem) | `BorderRadius.circular(12.0)` | `.cornerRadius(12.0)` | `RoundedCornerShape(12.dp)` |
| **Control Height** | `--control-height: 36px` | `h-9` | `height: 36.0` | `.frame(height: 36)` | `Modifier.height(36.dp)` |

---

## 2. Implementation Snippets

### Flutter
```dart
ThemeData buildDesignTheme() {
  return ThemeData(
    useMaterial3: true,
    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto',
    colorScheme: const ColorScheme.light(
      primary: Color(0xFF18181B),
      error: Color(0xFFEF4444),
      surface: Colors.white,
      onSurface: Color(0xFF09090B),
    ),
    scaffoldBackgroundColor: const Color(0xFFFFFFFF),
    cardTheme: const CardTheme(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: Color(0xFFE4E4E7)),
        borderRadius: BorderRadius.all(Radius.circular(8)),
      ),
    ),
  );
}
```

### SwiftUI (iOS)
```swift
extension Color {
    static let appPrimary = Color(hex: "#18181B")
    static let appSuccess = Color(hex: "#16A34A")
    static let appWarning = Color(hex: "#F59E0B")
    static let appDestructive = Color(hex: "#EF4444")
    static let appBackground = Color(hex: "#FFFFFF")
    static let appForeground = Color(hex: "#09090B")
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .medium))
            .padding(.horizontal, 16)
            .frame(height: 36)
            .background(configuration.isPressed ? Color(hex: "#27272A") : Color.appPrimary)
            .foregroundColor(.white)
            .cornerRadius(6)
    }
}
```
