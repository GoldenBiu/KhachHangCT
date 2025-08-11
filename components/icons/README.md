# Animated Icons Components

Thư mục này chứa các component icon động sử dụng Lottie animations từ [AnimatedIcons.co](https://animatedicons.co/).

## Cấu trúc thư mục

```
components/icons/
├── DoorIcon.tsx          # Icon cửa mở
├── HomeIcon.tsx          # Icon nhà
├── ReceiptIcon.tsx       # Icon hóa đơn
├── index.ts              # Export tất cả components
└── README.md             # Hướng dẫn sử dụng
```

## Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install lottie-react
```

### 2. Import và sử dụng
```tsx
import { DoorIcon, HomeIcon, ReceiptIcon } from '@/components/icons'

// Sử dụng cơ bản
<DoorIcon />

// Tùy chỉnh kích thước
<HomeIcon size={48} />

// Tùy chỉnh CSS classes
<ReceiptIcon className="h-12 w-12 text-blue-500" />

// Tắt hiệu ứng hover
<DoorIcon onHover={false} />
```

## Cách thêm icon mới

### 1. Tải icon từ AnimatedIcons.co
- Vào [AnimatedIcons.co](https://animatedicons.co/)
- Chọn icon muốn sử dụng
- Tùy chỉnh màu sắc, style
- Download file JSON (Lottie)

### 2. Lưu file
```
public/icons/lottie/
└── ten-icon.json
```

### 3. Tạo component
```tsx
// components/icons/TenIcon.tsx
import Lottie from 'lottie-react'
import tenIconAnimation from '@/public/icons/lottie/ten-icon.json'

export function TenIcon({ className = "h-8 w-8", size = 32, onHover = true }) {
  // ... component logic
}
```

### 4. Export trong index.ts
```tsx
export { TenIcon } from './TenIcon'
```

## Props

Tất cả icon components đều có các props sau:

- `className?: string` - CSS classes
- `size?: number` - Kích thước icon (px)
- `onHover?: boolean` - Bật/tắt hiệu ứng hover animation

## Lưu ý

- Icon sẽ tự động play khi hover
- Icon sẽ stop khi rời chuột
- Có thể tùy chỉnh animation behavior trong component
- File JSON phải được import đúng đường dẫn 