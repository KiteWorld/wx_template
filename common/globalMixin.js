export const mixin1 = {
  data: {
    title1: "mixin1",
    activeColor: "#fff"
  },
  getTitle1() {
    console.log("getTitle1", this.data.title1)
  }
}
export const mixin2 = {
  data: {
    title2: "mixin2"
  },
  getTitle2() {
    console.log("getTitle2", this.data.title2)
  }
}