import { DroneModel, DroneState } from "../enums";

export const droneFleet = [
  {
    serialNumber: "ASD_123",
    model: DroneModel.MIDDWEIGHT,
    weightLimitGrams: 300,
    batteryCapacity: 90,
    state: DroneState.DELIVERING,
    load: [{
      name: "Paracetamol 500mg x 5",
      weight: 200,
      code: "PCM_500",
      image: "https://images.ecestaticos.com/x19Odeat7X7sFOfTlTiGNqoONCc=/0x143:3974x2379/1440x810/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F742%2F69a%2Fccf%2F74269accf14f3a89df5f365ad6d3f16c.jpg"
    }]
  }, {
    serialNumber: "ASD_124",
    model: DroneModel.MIDDWEIGHT,
    weightLimitGrams: 250,
    batteryCapacity: 95,
    state: DroneState.IDLE,
    load: []
  }, {
    serialNumber: "ASD_125",
    model: DroneModel.LIGHTWEIGHT,
    weightLimitGrams: 150,
    batteryCapacity: 90,
    state: DroneState.RETURNING,
    load: []
  }, {
    serialNumber: "ASD_126",
    model: DroneModel.LIGHTWEIGHT,
    weightLimitGrams: 50,
    batteryCapacity: 100,
    state: DroneState.DELIVERED,
    load: []
  }, {
    serialNumber: "ASD_127",
    model: DroneModel.CRUISEWEIGHT,
    weightLimitGrams: 400,
    batteryCapacity: 90,
    state: DroneState.IDLE,
    load: []
  }, {
    serialNumber: "ASD_128",
    model: DroneModel.CRUISEWEIGHT,
    weightLimitGrams: 400,
    batteryCapacity: 90,
    state: DroneState.IDLE,
    load: []
  }, {
    serialNumber: "ASD_129",
    model: DroneModel.HEAVYWEIGHT,
    weightLimitGrams: 500,
    batteryCapacity: 98,
    state: DroneState.RETURNING,
    load: []
  }, {
    serialNumber: "ASD_121",
    model: DroneModel.HEAVYWEIGHT,
    weightLimitGrams: 450,
    batteryCapacity: 88,
    state: DroneState.RETURNING,
    load: []
  }, {
    serialNumber: "ASD_122",
    model: DroneModel.MIDDWEIGHT,
    weightLimitGrams: 280,
    batteryCapacity: 15,
    state: DroneState.IDLE,
    load: []
  }, {
    serialNumber: "ASG_123",
    model: DroneModel.CRUISEWEIGHT,
    weightLimitGrams: 380,
    batteryCapacity: 12,
    state: DroneState.IDLE,
    load: []
  }
]
