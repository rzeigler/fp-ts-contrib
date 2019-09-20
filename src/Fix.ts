import { HKT } from 'fp-ts/lib/HKT'
import { Functor } from "fp-ts/lib/Functor";
import { FunctionN } from 'fp-ts/lib/function';

export const URI = 'Fix'

export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
    interface URItoKind<A> {
        Fix: Fix<A>
    }
}

export interface Fix<F> {
    unfix: HKT<F, Fix<F>>
}

export function fix<F>(point: HKT<F, Fix<F>>): Fix<F> {
    return { unfix: point };
}

export function ana<F>(F: Functor<F>): <A>(coalg: FunctionN<[A], HKT<F, A>>) => FunctionN<[A], Fix<F>> {
    return <A>(coalg: FunctionN<[A], HKT<F, A>>) => (a: A): Fix<F> => 
        fix(F.map(coalg(a), ana<F>(F)(coalg)))
}

export function cata<F>(F: Functor<F>): <A>(alg: FunctionN<[HKT<F, A>], A>) => FunctionN<[Fix<F>], A> {
    return <A>(alg: FunctionN<[HKT<F, A>], A>) => (point: Fix<F>): A =>
        alg(F.map(point.unfix, cata<F>(F)(alg)))
}

