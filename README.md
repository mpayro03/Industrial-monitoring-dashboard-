# Industrial Monitoring Dashboard 
An industrial monitoring dashboard designed to support manufacturing floor operators in tracking production KPIs, machine status, and operational alerts in real time. The application combines shift-based data simulation, digital area monitoring, OEE visualization, and automated shift reporting to support data-driven decision-making in consumer goods manufacturing environments.

# Overview project
Developed as a personal portfolio project, this dashboard simulates a real-world industrial monitoring workflow based on standards used in consumer goods manufacturing plants. The platform enables users to evaluate production performance through an intuitive interface that centralizes operational KPIs, machine diagnostics, area-level metrics, and automated shift documentation.

Machine states follow the **PackML standard (ISA-TR88.00.02)** OEE is calculated according to **ISO 22400-2:2014 (Availability × Performance × Quality)**, and environmental parameters are modeled based on **GMP/ISO 14644 guidelines** for controlled manufacturing environments.

# Features
- **Real-Time KPI Simulation:** Displays shift production metrics including units produced, OEE, capacity utilization, active hours, and unplanned stops — updated every 5 seconds with realistic sensor-level variability.
- **OEE by Area:**  Progress bars showing OEE performance per production area against world-class benchmarks.
- **Machine Status Grid:** Color-coded machine cards following PackML states (Running, Idle, Fault, Maintenance) with efficiency bars, temperature readings, and last-event descriptions.
- **Area Filtering:**  Interactive filtering by production area (Making, Packing, Warehouse, Quality, HSE) across all dashboard views.
- **Alerts Panel:** Prioritized alert system with four severity levels (Critical, Warning, Info, OK) including acknowledge functionality and automated action recommendations.
- **Quality View:** Defect rate trend chart, critical parameter table with regulatory standard references (ISO 22400-2, ISO 2859-1, PackML ISA-88).
- **Automated Shift Reporting:** One-click generation of a structured shift report (.txt) and machine status export (.csv), modeling an estimated reduction in manual documentation time versus traditional logging methods.
- **Environmental Monitoring Panel:** Displays room temperature, humidity, noise level, energy consumption, and air quality per shift.
- **Responsive User Interface:** Fully responsive layout across desktop and mobile viewports.
  
# Project Structure
```text
├── css/
│   ├── variables.css          # Design token system (colors, typography, spacing)
│   ├── reset.css              # Browser normalize and global box-sizing
│   ├── layout.css             # Topbar, hero section, cards row, view structure
│   ├── element.css            # Cards, status pills, alert cards, bars, buttons
│   └── animations.css         # Pulse effects, transitions, skeleton loading
├── js/
│   ├── state.js               # Centralized reactive store (Observer pattern)
│   ├── data.js                # Machine catalog and shift-based simulated data
│   ├── funciones.js           # Rendering logic, formatting, charts, and report export
│   ├── ui.js                  # View navigation and shift/area selection handlers
│   └── app.js                 # Main orchestrator — initializes the app and update loop
├── index.html                 # Single entry point — all views rendered here
└── README.md                  # Project documentation
```
# Technologies
- **Languages:** HTML5, CSS3, JavaScript
- **Libraries & Tools:** Chart.js, Git, GitHub, VSC
- **Industrial Standards Referenced:** PackML (ISA-TR88.00.02), ISO 22400-2:2014, GMP, ISO 14644, ISO 2859-1

# Live DEMO
https://mpayro03.github.io/Industrial-monitoring-dashboard-/

# Installation
No package installation is required.

*Developed by Melissa Payró*
