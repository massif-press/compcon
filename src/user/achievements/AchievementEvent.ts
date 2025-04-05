class AchievementEventSystem {
  private static observers: { [event: string]: ((event: any) => void)[] } = {};

  static subscribe(eventType: string, callback: (event: any) => void) {
    if (!eventType) return;
    if (!this.observers[eventType]) {
      this.observers[eventType] = [];
    }
    this.observers[eventType].push(callback);
  }

  static emit(eventType: string, event?: any) {
    if (this.observers[eventType]) {
      console.log(`Event emitted: ${eventType}`, event);
      console.log(`Observers: ${this.observers[eventType]}`);
      this.observers[eventType].forEach((callback) => callback(event));
    }
  }
}

export { AchievementEventSystem };
