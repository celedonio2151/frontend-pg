export interface CubesMonth {
    cubics:   number;
    readings: Reading[];
}

export interface Reading {
    month:            string;
    totalCubicMeters: number;
}
