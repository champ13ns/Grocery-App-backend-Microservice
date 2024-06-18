class ArrayWrapper {
    nums;
   constructor(nums) {
       this.nums = nums;
   }

   valueOf() {
       let initialValue = 0;
       return this.nums.reduce((accumulator, currentValue) => accumulator + currentValue , initialValue);
   }

   toString() {
    //    return `"[${this.nums}"`
    return `[${this.nums.join(',')}]`

   }
}

const obj = new ArrayWrapper([1,23]);
const obj2 = new ArrayWrapper([5,6]);

console.log(obj + obj2);
console.log(String(obj));