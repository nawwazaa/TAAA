# FlixMarket API Reference

## Authentication Context API

### AuthContext Methods

#### `login(userData: User): void`
Authenticates user and stores session data.

**Parameters:**
- `userData`: Complete user object with profile information

**Example:**
```typescript
const userData = {
  id: 'user_123',
  name: 'John Doe',
  email: 'john@example.com',
  userType: 'user',
  flixbits: 100
};
login(userData);
```

#### `loginWithTestAccount(email: string): boolean`
Quick login using predefined test accounts.

**Parameters:**
- `email`: Email of test account

**Returns:**
- `boolean`: Success status

**Example:**
```typescript
const success = loginWithTestAccount('user@test.com');
```

#### `generateReferralCode(): string`
Generates unique referral code for user.

**Returns:**
- `string`: Formatted referral code

**Example:**
```typescript
const code = generateReferralCode(); // Returns: "USER-ABC123"
```

---

## QR Code API

### QR Generation (`src/utils/qrCode.ts`)

#### `generateQRCode(data: string): Promise<string>`
Creates QR code image from data string.

**Parameters:**
- `data`: String data to encode in QR code

**Returns:**
- `Promise<string>`: Base64 encoded QR code image

**Example:**
```typescript
const qrData = generateUserQRData('user_123', 'user');
const qrImage = await generateQRCode(qrData);
```

#### `generateUserQRData(userId: string, userType: string): string`
Creates standardized QR data for users.

**Parameters:**
- `userId`: Unique user identifier
- `userType`: Type of user (user/seller/influencer)

**Returns:**
- `string`: JSON string with user data

**Example:**
```typescript
const qrData = generateUserQRData('user_123', 'seller');
// Returns: '{"userId":"user_123","userType":"seller","platform":"FlixMarket","timestamp":1640995200000}'
```

### QR Scanning (`src/components/QR/EnhancedQRScanner.tsx`)

#### `onScanSuccess(decodedText: string, decodedResult: any): void`
Handles successful QR code detection.

**Parameters:**
- `decodedText`: Raw QR code text
- `decodedResult`: Html5Qrcode result object

**Process:**
1. Parse QR data as JSON
2. Validate format and content
3. Capture camera frame
4. Set scanned data state

#### `confirmScan(): Promise<void>`
Processes confirmed QR scan and awards rewards.

**Process:**
1. Calculate Flixbits reward based on scan mode
2. Update user balance
3. Record transaction
4. Show success feedback

---

## Permissions API

### PermissionsManager (`src/utils/PermissionsManager.ts`)

#### `checkCameraPermission(): Promise<'granted' | 'denied' | 'prompt'>`
Checks current camera permission status.

**Returns:**
- `Promise<string>`: Permission state

**Example:**
```typescript
const status = await permissionsManager.checkCameraPermission();
if (status === 'granted') {
  // Camera available
}
```

#### `requestCameraPermission(): Promise<MediaStream | null>`
Requests camera access with fallback handling.

**Returns:**
- `Promise<MediaStream | null>`: Camera stream or null if denied

**Process:**
1. Try back camera first (`facingMode: 'environment'`)
2. Fallback to front camera if back camera fails
3. Handle specific error types
4. Return stream or throw descriptive error

#### `requestLocationPermission(): Promise<{lat: number, lng: number} | null>`
Requests user's current location.

**Returns:**
- `Promise<object | null>`: Coordinates or null if denied

**Example:**
```typescript
try {
  const location = await permissionsManager.requestLocationPermission();
  console.log(`User at: ${location.lat}, ${location.lng}`);
} catch (error) {
  console.error('Location denied:', error.message);
}
```

---

## Voice Assistant API

### Voice Recognition (`src/features/VoiceAssistant/hooks/useVoiceRecognition.ts`)

#### `startListening(): void`
Begins voice recognition session.

**Process:**
1. Check if speech recognition is supported
2. Configure language and settings
3. Start continuous listening
4. Handle speech events

#### `processCommand(transcript: string, confidence: number): Promise<VoiceResponse>`
Processes voice command and generates response.

**Parameters:**
- `transcript`: Recognized speech text
- `confidence`: Recognition confidence (0-1)

**Returns:**
- `Promise<VoiceResponse>`: Response with text and actions

### Natural Language Processing (`src/features/VoiceAssistant/utils/nlp.ts`)

#### `processNaturalLanguage(text: string): NLPResult`
Extracts intent and parameters from text.

**Parameters:**
- `text`: Input text to analyze

**Returns:**
- `NLPResult`: Object with intent, parameters, and confidence

**Example:**
```typescript
const result = processNaturalLanguage("find nearby restaurants");
// Returns: { intent: 'search', parameters: { category: 'restaurants' }, confidence: 0.8 }
```

---

## Wallet Management API

### Wallet Operations (`src/features/WalletManagement/hooks/useWallet.ts`)

#### `addTransaction(transaction): WalletTransaction`
Records new wallet transaction.

**Parameters:**
- `transaction`: Transaction object without ID/timestamp

**Returns:**
- `WalletTransaction`: Complete transaction record

**Example:**
```typescript
const transaction = addTransaction({
  type: 'earn',
  amount: 150,
  description: 'QR Code Scan Reward',
  category: 'qr_scan',
  status: 'completed'
});
```

#### `getTransactionsByCategory(category: string): WalletTransaction[]`
Filters transactions by category.

**Parameters:**
- `category`: Transaction category

**Returns:**
- `WalletTransaction[]`: Filtered transactions

### Exchange Operations (`src/features/WalletManagement/hooks/useExchange.ts`)

#### `createBuyOrder(usdAmount: number, paymentMethodId: string): Promise<ExchangeOrder>`
Creates order to buy Flixbits with USD.

**Parameters:**
- `usdAmount`: USD amount to spend
- `paymentMethodId`: Payment method identifier

**Returns:**
- `Promise<ExchangeOrder>`: Order details

#### `createSellOrder(flixbitsAmount: number, paymentMethodId: string): Promise<ExchangeOrder>`
Creates order to sell Flixbits for USD.

**Parameters:**
- `flixbitsAmount`: Flixbits amount to sell
- `paymentMethodId`: Payment method identifier

**Returns:**
- `Promise<ExchangeOrder>`: Order details

---

## Admin Panel API

### User Management (`src/components/Admin/UserSearch.tsx`)

#### `searchUsers(query: string, filters: object): UserSearchResult[]`
Searches users with advanced filtering.

**Parameters:**
- `query`: Search query string
- `filters`: Filter object with criteria

**Returns:**
- `UserSearchResult[]`: Matching users

#### `handleUserAction(userId: string, action: string): void`
Performs admin action on user account.

**Parameters:**
- `userId`: Target user ID
- `action`: Action type ('view'|'edit'|'suspend'|'activate'|'delete')

### Transaction Management (`src/components/Admin/TransactionManager/`)

#### `updateTransaction(id: string, updates: Partial<Transaction>): void`
Updates transaction record.

**Parameters:**
- `id`: Transaction ID
- `updates`: Partial transaction object with updates

#### `exportTransactions(transactions: Transaction[]): void`
Exports transaction data to CSV.

**Parameters:**
- `transactions`: Array of transactions to export

---

## Event System API

### Draw Events (`src/features/DrawWinners/`)

#### `createEvent(eventData: Partial<DrawEvent>): DrawEvent`
Creates new prize draw event.

**Parameters:**
- `eventData`: Event configuration object

**Returns:**
- `DrawEvent`: Complete event object

#### `conductDraw(event: DrawEvent): Promise<DrawWinner[]>`
Conducts fair prize draw for event.

**Parameters:**
- `event`: Event to conduct draw for

**Returns:**
- `Promise<DrawWinner[]>`: Selected winners

---

## Utility Functions

### Formatting (`src/features/WalletManagement/utils/helpers.ts`)

#### `formatFlixbits(amount: number): string`
Formats Flixbits amount for display.

**Example:**
```typescript
formatFlixbits(1500); // Returns: "1.5K FB"
formatFlixbits(50);   // Returns: "50 FB"
```

#### `formatUSD(amount: number): string`
Formats USD amount with currency symbol.

**Example:**
```typescript
formatUSD(25.50); // Returns: "$25.50"
```

### Distance Calculation

#### `calculateDistance(lat1, lng1, lat2, lng2): number`
Calculates distance between two coordinates.

**Parameters:**
- `lat1, lng1`: First coordinate pair
- `lat2, lng2`: Second coordinate pair

**Returns:**
- `number`: Distance in meters

---

## Error Handling

### Common Error Types

#### Camera Errors
```typescript
try {
  const stream = await requestCameraPermission();
} catch (error) {
  switch (error.name) {
    case 'NotAllowedError':
      // Permission denied
      break;
    case 'NotFoundError':
      // No camera found
      break;
    case 'NotSupportedError':
      // Browser not supported
      break;
  }
}
```

#### QR Scanning Errors
```typescript
const validateQRCode = (qrData) => {
  if (!qrData.eventId) {
    return { isValid: false, error: 'Missing event ID' };
  }
  if (qrData.expired) {
    return { isValid: false, error: 'QR code expired' };
  }
  return { isValid: true };
};
```

---

## Configuration

### Environment Variables
```env
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_TAP_API_KEY=your_tap_api_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Feature Flags
```typescript
const FEATURES = {
  VOICE_ASSISTANT: true,
  PAYMENT_GATEWAY: true,
  LOCATION_VERIFICATION: true,
  PUSH_NOTIFICATIONS: false
};
```

This API reference provides detailed information for developers working with the FlixMarket platform, including all major functions, their parameters, return values, and usage examples.