export default abstract class Packet {
  public packetType!: string
  public abstract handle (payload: any): Promise<void>
}