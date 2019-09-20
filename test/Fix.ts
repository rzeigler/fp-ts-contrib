import * as assert from 'assert'
import { identity, FunctionN } from 'fp-ts/lib/function'
import { Functor1 } from 'fp-ts/lib/Functor'
import { Fix, ana, cata } from "../src/Fix";

const URI = 'Lang'
type URI = typeof URI

class Mult<A> {
    readonly _URI!: URI
    readonly _tag: 'Mult' = 'Mult'
    constructor(readonly a: A, readonly b: A) { }
}

function mult<A>(a: A, b: A): Mult<A> {
    return new Mult(a, b)
}

class Lit<A> {
    readonly _URI!: URI
    readonly _tag: 'Lit' = 'Lit'
    constructor(readonly value: number, ) { }
}

function lit<A>(value: number): Lit<A> {
    return new Lit(value);
}

type LangF<A> = Mult<A> | Lit<A>

declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        Lang: LangF<A>
    }
}

const langFunctor: Functor1<URI> = {
    URI,
    map: <A, B>(fa: LangF<A>, f: FunctionN<[A], B>): LangF<B> =>
        fa._tag === 'Mult' ? new Mult(f(fa.a), f(fa.b)) : new Lit(fa.value)
}

describe("Fix", () => {
    describe("anamorphism", () => {
        it("should unfold", () => {
            const factorialCoalg = (n: number): LangF<number> => {
                if (n > 1) {
                    return mult(n - 1, 1);
                } else {
                    return lit(1);
                }
            }
            const expr = ana<URI>(langFunctor)(factorialCoalg, 3)
        })
    })
})