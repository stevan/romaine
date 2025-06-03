
// -----------------------------------------------------------------------------

export type Unknown<T> = { type : 'UNKNOWN' }
export type Known<T>   = { type : 'KNOWN', value : T }

export type Scalar<T> = Known<T> | Unknown<T>

function isUnknown<T> (s: Scalar<T>) : s is Unknown<T> { return s.type == 'UNKNOWN' }
function isKnown<T>   (s: Scalar<T>) : s is Known<T>   { return s.type == 'KNOWN'   }

function Known<T>   (v: T) : Scalar<T> { return { type : 'KNOWN', value : v } }
function Unknown<T> ()     : Scalar<T> { return { type : 'UNKNOWN' } }

// -----------------------------------------------------------------------------

interface SemiLattice<T> {
    join     (o : T)        : void;
    is_empty (o : T)        : boolean;
    is_full  (o : T)        : boolean;
    equal_to (o : T, n : T) : boolean;
    merge    (o : T, n : T) : T;
}

class ScalarLattice<T> implements SemiLattice<Scalar<T>> {
    constructor(
        public contents : Scalar<T>,
        public version  : number = 1,
    ) {}

    join (s: Scalar<T>) : void {
        let result = this.merge(this.contents, s);
        if (result !== this.contents) {
            this.contents = result;
            this.version++;
        }
    }

    is_empty (o : Scalar<T>) : boolean { return isUnknown<T>(o) }
    is_full  (o : Scalar<T>) : boolean { return isKnown<T>(o)   }

    equal_to (o : Scalar<T>, n : Scalar<T>) : boolean {
        if (isKnown<T>(o) && isKnown<T>(n)) {
            return o.value == n.value;
        }
        return false;
    }

    merge (o: Scalar<T>, n : Scalar<T>) : Scalar<T> {
        switch (true) {
        case isUnknown<T>(o) && isKnown<T>(n):
            return n;
        case isKnown<T>(o)   && isKnown<T>(n):
            return (o.value == n.value) ? o : n;
        case isKnown<T>(o)   && isUnknown<T>(n):
        case isUnknown<T>(o) && isUnknown<T>(n):
            return o;
        default:
            throw new Error("Bad merge combination")
        }
    }
}

// -----------------------------------------------------------------------------

let sl = new ScalarLattice<number>( Known<number>(10) );
console.log(sl);

sl.join( Unknown<number>() );
console.log(sl);


sl.join( Known<number>(200) );
console.log(sl);






