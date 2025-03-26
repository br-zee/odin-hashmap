class Node {
    value = null;
    nextNode = null;

    constructor(val, next=null) {
        this.value = val;
        this.nextNode = next;
    }
}

class LinkedList {
    head = null;
    tail = null;

    append(value) {
        const node = new Node(value, null);
        if (this.head == null) {
            this.head = node;
            this.tail = node;
        }
        else {
            this.tail.nextNode = node;
            this.tail = node;
        }
    }

    size() {
        let size = 0;
        let list = this.head;
        while (list) {
            size++;
            list = list.nextNode;
        }
        return size;
    }

    head() {
        return this.head;
    }

    tail() {
        return this.tail;
    }

    at(index) {
        let list = this.head;
        for (let i = 0; i < index; i++) {
            list = list.nextNode;
        }
        try {
            return list.value;
        }
        catch(err) {
            return "ERROR: OUT OF BOUNDS";
        }
    }

    pop() {
        let list = this.head;
        for (let i = 0; i < this.size()-2; i++) {
            list = list.nextNode;
        }
        this.tail = list;
        this.tail.nextNode = null;
    }

    contains(value) {
        let list = this.head;
        while (list) {
            if (list.value === value) {
                return true;
            }
            list = list.nextNode;
        }
        return false;
    }

    toString() {
        let list = this.head;
        let string = "";
        while (list) {
            string += `( ${list.value} )`;
            list = list.nextNode;
            if (list) {
                string += " -> ";
            }
        }
        return string;
    }
}

class Hashmap {
    loadFactor = 0.75;
    capacity = 16;
    buckets = [];

    constructor(lf=0.75, cap=16) {
        this.loadFactor = lf;
        this.capacity = cap;
    }

    hash(key) {
        let hashCode = 0;
            
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
            hashCode %= this.capacity;
        }
        
        return hashCode;
    }

    set(key, value) {
        const index = this.#checkIndex(this.hash(key));
        if (this.buckets[index] == null) {
            const list = new LinkedList();
            list.append([key, value]);

            this.buckets[index] = list;
        } 
        else if (this.has(key)) {
            let head = this.buckets[index].head;
            while (head) {

                if (head.value[0] === key) {
                    head.value[1] = value;
                    break;
                }
                head = head.nextNode;
            }
        }
        else {
            const list = this.buckets[index];
            list.append([key, value]);

            if (this.entries().length > (this.capacity * this.loadFactor)) {
                this.capacity = this.capacity * 2;

                const entries = this.entries();
                this.clear();
                for (const entry of entries) {  
                    this.set(entry[0], entry[1]);
                }
            }
        }
    }

    get(key) {
        if (this.has(key)) {
            const index = this.#checkIndex(this.hash(key));
            if (this.buckets[index] != null) {
                let head = this.buckets[index].head;
                while (head) {
                    if (head.value[0] === key) {
                        return head.value[1];
                    }
                    head = head.nextNode;
                }
            }
        }
        return null;
    }

    has(key) {
        const index = this.#checkIndex(this.hash(key));
        if (this.buckets[index] != null) {
            let head = this.buckets[index].head;
            while (head) {
                if (head.value[0] === key) {
                    return true;
                }
                head = head.nextNode;
            }
        }
        return false;
    }

    remove(key) {
        if (this.has(key)) {
            const index = this.#checkIndex(this.hash(key));
            let head = this.buckets[index].head;

            let prev, next;
            while (head) {
                next = head.nextNode;

                if (head.value[0] === key) {
                    if (next) {
                        this.buckets[index].head = next;
                        if (prev) {
                            prev.nextNode = next;
                        }
                    }
                    else {
                        prev.nextNode = null;
                        this.buckets[index].tail = null;
                    }
                    return true;
                }
                else if (next.value[0] === key) {
                    prev = head;
                }
                head = next;
            }
            return false;
        }
    }

    length() {
        let size = 0;
        for (let bucket of this.buckets) {
            if (bucket) {
                let head = bucket.head;

                while (head) {
                    size++;
                    head = head.nextNode;
                }
            }
        }
        return size;
    }

    clear() {
        this.buckets = [];
    }    

    keys() {
        const keys = [];
        for (let bucket of this.buckets) {
            if (bucket) {
                let head = bucket.head;

                while (head) {
                    keys.push(head.value[0]);
                    head = head.nextNode;
                }
            }            
        }
        return keys;
    }

    entries() {
        const pairs = [];
        for (let bucket of this.buckets) {
            if (bucket) {
                let head = bucket.head;
                
                while (head) {
                    pairs.push([head.value[0], head.value[1]]);
                    head = head.nextNode;
                }
            }
        }
        return pairs;
    }

    #checkIndex(index) {
        if (index < 0 || index >= this.capacity) {
            throw new Error("Trying to access index out of bounds");
        }   
        return index;
    }
}

const test = new Hashmap();

test.set('apple', 'red')
test.set('banana', 'yellow')
test.set('carrot', 'orange')
test.set('dog', 'brown')
test.set('elephant', 'gray')
test.set('frog', 'green')
test.set('grape', 'purple')
test.set('hat', 'black')
test.set('ice cream', 'white')
test.set('jacket', 'blue')
test.set('kite', 'pink')
test.set('lion', 'golden')

// test.remove("dog");

// console.log(test.get("lion"));

// console.log(test.length());

// console.log(test.keys());

// console.log(test.entries());


// console.log(test.buckets)

test.set('moon', 'silver')

// console.log(test.buckets)



class Hashset {
    capacity = 16;
    loadFactor = 0.75;
    buckets = [];

    constructor(cap=16, load=0.75) {
        this.capacity = cap;
        this.loadFactor = load;
    }

    hash(key) {
        let hashCode = 0;
            
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
            hashCode %= this.capacity;
        }
        
        return hashCode;
    }

    add(key) {
        const index = this.#checkIndex(this.hash(key));
        this.buckets[index] = key;

        if (this.keys().length > (this.capacity * this.loadFactor)) {
            this.capacity = this.capacity * 2;

            const keys = this.keys();
            this.buckets = [];
            for (const key of keys) {
                this.add(key);
            }
        }
    }

    keys() {
        let keys = [];
        for (const bucket of this.buckets) {
            if (bucket) {
                keys.push(bucket);
            }
        }
        return keys;
    }

    #checkIndex(index) {
        if (index < 0 || index >= this.capacity) {
            throw new Error("Trying to access index out of bounds");
        }   
        return index;
    }
}

const hashset = new Hashset();

hashset.add('xxxxxxxx');
hashset.add('dwddddd');
hashset.add('lolloaloadw');
hashset.add('a');
hashset.add('xzxzxzzxzxzxzxzxzx');
hashset.add('fruit');
hashset.add('yaaauauauauaudahwuidhawiuhduidhuaid');
hashset.add('zucchini');
hashset.add('cucumber');
hashset.add('xylophon');
hashset.add('zxz');
hashset.add('dd');
hashset.add('blubbm');
hashset.add('afniowadoawjdioawjoidjawoidjaowijdoiwajdioajdjaiwjdioawjoidjaw');
hashset.add('aidjawhdawdiojawoidjioawjdoiawjdoiajwoidjawodjioawjdiojawodjiowjdoiawjodij');
hashset.add('adjiauwhfqwru089ty032ewovijsdkvnuovhoweifewaowjdiuaowdgwa8y8 bqwyf9q9fqwfh uiqwh uidwqud quwdh uiwqdqi');
hashset.add('adjiauwhfqwru089ty032ewovijsdkvnuovhoweifew awdiuawhodijawoidjaowidjoawjdoiajwdiojwaoidjaidjoiawjdioawj');

// console.log(hashset)
// console.log(hashset.capacity * hashset.loadFactor)
// console.log(hashset.keys().length)