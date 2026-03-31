# 📡 ESP8266 IoT Firmware

> Firmware for ESP8266-based modules with MQTT communication, sensor reporting, IR input handling, and local HTTP provisioning — designed for local IoT ecosystems backed by a NestJS control plane.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Provisioning](#provisioning)
- [MQTT Protocol](#mqtt-protocol)
- [Hardware & Pin Model](#hardware--pin-model)
- [Sensors & Actuators](#sensors--actuators)
- [LED State Machine](#led-state-machine)
- [Operational Flow](#operational-flow)
- [Backend Integration](#backend-integration)
- [Limitations](#limitations)

---

## Overview

The device operates in **dual mode**:

| Mode                 | Purpose                                 |
| -------------------- | --------------------------------------- |
| 🔵 Access Point (AP) | Initial provisioning via HTTP           |
| 🟢 Station (STA)     | Normal operation within a local network |

**Capabilities at a glance:**

- Remote control and monitoring via MQTT
- DHT11 temperature & humidity sensing
- Samsung IR remote input handling
- Local configuration via browser (HTTP)
- Unique device identity derived from MAC address

---

## Architecture

### Communication Model

| Property      | Value                                 |
| ------------- | ------------------------------------- |
| Protocol      | MQTT over TCP                         |
| Broker Port   | `1883`                                |
| Topic         | `ESP_COM` (shared across all devices) |
| Auth Username | `custom_username`                     |
| Auth Password | `custom_password`                     |

All devices **publish and subscribe** to the same topic, filtering messages by `id`.

### Device Identification

Each device generates a unique ID from its MAC address:

```
AA:BB:CC:DD:EE:FF
```

Used for message routing, backend association, and device tracking.

---

## Provisioning

### Access Point

On boot, the device starts a configuration AP:

| Property | Value         |
| -------- | ------------- |
| SSID     | `ESP01_02`    |
| Password | `ESP40637184` |
| IP       | `192.168.4.1` |

### HTTP Endpoints

| Endpoint  | Method | Description            |
| --------- | ------ | ---------------------- |
| `/`       | GET    | Configuration UI       |
| `/save`   | POST   | Save Wi-Fi credentials |
| `/saveIP` | POST   | Save MQTT broker IP    |

### EEPROM Layout

| Field          | Address | Size |
| -------------- | ------- | ---- |
| SSID           | 0       | 32 B |
| Password       | 32      | 64 B |
| MQTT Broker IP | 96      | 16 B |
| Config Flag    | 132     | 1 B  |

> Config flag `0xA5` indicates a valid stored configuration.

### Wi-Fi Behavior

- Always runs in **AP + STA** combined mode
- If valid credentials exist → attempts STA connection, retrying every 10 seconds
- Connection failures → LED blinks slowly
- Connected → LED stays ON

---

## MQTT Protocol

### Topic

```
ESP_COM
```

### Message Formats

#### ▶️ Command — Backend → Device

```json
{
	"id": "DEVICE_ID",
	"action": "set | read",
	"pin": "PIN",
	"value": "VALUE"
}
```

#### ✅ State Update — Device → Backend

```json
{
	"id": "DEVICE_ID",
	"action": "update",
	"pin": "PIN",
	"value": "VALUE"
}
```

#### ❌ Error Response

```json
{
	"id": "DEVICE_ID",
	"action": "error",
	"pin": "PIN",
	"error": "unavailable_pin"
}
```

### Special Messages

#### Device Capability Discovery

**Request:**

```json
{"id": "device_report"}
```

**Response:**

```json
{
	"id": "report",
	"device": "DEVICE_ID",
	"pins": ["1:LED OUT", "2:DHT11", "3:IR_SENSOR"]
}
```

---

## Hardware & Pin Model

The firmware uses an **abstract logical pin system**, decoupled from physical GPIO numbers.

```c
enum PinModeType {
  PIN_UNUSED,
  PIN_INPUT,
  PIN_GPIO,
  PIN_ANALOG,
  PIN_RESERVED
};
```

### Pin Map

| Logical Pin | Mode     | Description    |
| ----------- | -------- | -------------- |
| 1           | GPIO     | General output |
| 2           | RESERVED | Onboard LED    |
| 3           | RESERVED | IR Receiver    |
| 0           | RESERVED | System use     |

> ⚠️ The `pin` field in MQTT messages is a **logical identifier**, not a direct physical GPIO mapping. Some pins (e.g. `"12"`) are virtual.

---

## Sensors & Actuators

### 🌡️ DHT11 Sensor

| Property           | Value     |
| ------------------ | --------- |
| Physical Pin       | GPIO1     |
| Poll Interval      | 5 seconds |
| Temp threshold     | ±0.25 °C  |
| Humidity threshold | ±1%       |

**Example output:**

```json
{ "id": "DEVICE_ID", "action": "update", "pin": "12", "value": { "temp": 25.30 } }
{ "id": "DEVICE_ID", "action": "update", "pin": "12", "value": { "hum": 60.0 } }
```

### 📻 IR Receiver

| Property     | Value          |
| ------------ | -------------- |
| Physical Pin | GPIO3          |
| Protocol     | Samsung 32-bit |
| Trigger Code | `0x707000FF`   |

On match: toggles LED state and sends an MQTT update.

### 💡 Digital Output (Actuator)

**Write:**

```json
{"id": "DEVICE_ID", "action": "set", "pin": "1", "value": "1"}
```

Accepted values: `"1"` / `"HIGH"` or `"0"` / `"LOW"`

**Read:**

```json
{"id": "DEVICE_ID", "action": "read", "pin": "1"}
```

---

## LED State Machine

| State               | Behavior   |
| ------------------- | ---------- |
| Boot                | OFF        |
| Connecting to Wi-Fi | Fast blink |
| Wi-Fi connected     | ON         |
| MQTT reconnecting   | Slow blink |

---

## Operational Flow

```
1. Boot
2. Start AP mode
3. Load config from EEPROM
4. Attempt Wi-Fi connection (STA)
5. Connect to MQTT broker
6. Subscribe to ESP_COM
7. Main loop:
   ├── Handle HTTP requests
   ├── Maintain MQTT connection
   ├── Process incoming messages
   ├── Send sensor updates
   └── Handle IR input
```

---

## Backend Integration

The NestJS backend must:

- Subscribe to `ESP_COM`
- Filter messages by `id` field
- Handle action types: `update`, `error`, `report`
- Maintain a device registry indexed by MAC-derived `deviceId`
- Interpret `pin` as a **logical identifier**, not a hardware GPIO number

---

## ⚠️ Limitations

### Protocol

- Single shared topic — no device isolation
- No QoS guarantees
- No message acknowledgment

### Parsing

- Manual JSON parsing via `strstr`
- Fragile to format variations

### Security

- Shared MQTT credentials across all devices
- No per-device authentication

### Data Model

- Inconsistent pin identifiers
- Mixed primitive and object values in the `value` field

> These are known constraints. Protocol normalization and stricter data contracts are recommended for scaling.

---

## 📄 License

This project is unlicensed. Add your preferred license here.
