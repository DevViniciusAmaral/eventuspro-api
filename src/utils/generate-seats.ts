export const generateSeats = (capacity: number, seatsPerRow = 10) => {
  const seats: string[] = [];

  for (let i = 0; i < capacity; i++) {
    const rowIndex = Math.floor(i / seatsPerRow);
    const seatNumber = (i % seatsPerRow) + 1;

    const row = String.fromCharCode(65 + rowIndex);
    const seat = String(seatNumber).padStart(3, "0");

    seats.push(`${row}${seat}`);
  }

  return seats;
};
