import ParkedCar from "../domain/entities/ParkedCar";
import ParkedCarRepository from "../ports/outbound/ParkedCarRepository";

export default class Checkin {
  constructor(readonly parkedCarRepository: ParkedCarRepository) {}

  async execute(input: Input): Promise<void> {
    await this.parkedCarRepository.save(
      new ParkedCar(input.plate, new Date(input.checkinDate))
    );
  }
}

type Input = {
  plate: string;
  checkinDate: string;
};
