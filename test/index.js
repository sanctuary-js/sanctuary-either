'use strict';

const assert        = require ('assert');

const laws          = require ('fantasy-laws');
const jsc           = require ('jsverify');
const Identity      = require ('sanctuary-identity');
const show          = require ('sanctuary-show');
const Z             = require ('sanctuary-type-classes');
const type          = require ('sanctuary-type-identifiers');
const Useless       = require ('sanctuary-useless');

const Either        = require ('..');


const {Left, Right} = Either;


//    EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
const EitherArb = arbL => arbR =>
  jsc.oneof (arbL.smap (Left, left => left.value, show),
             arbR.smap (Right, right => right.value, show));

//    IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
const IdentityArb = arb => arb.smap (Identity, Z.extract, show);

//    head :: Array a -> Either String a
const head = xs =>
  xs.length === 0 ? Left ('head undefined for ' + show (xs)) : Right (xs[0]);

//    sqrt :: Number -> Either String Number
const sqrt = n =>
  n < 0 ? Left ('sqrt undefined for ' + show (n)) : Right (Math.sqrt (n));

//    testLaws :: Object -> Object -> Undefined
const testLaws = laws => arbs => {
  (Object.keys (laws)).forEach (name => {
    eq (laws[name].length) (arbs[name].length);
    test (name.replace (/[A-Z]/g, c => ' ' + c.toLowerCase ()),
          laws[name] (...arbs[name]));
  });
};

//    eq :: a -> b -> Undefined !
function eq(actual) {
  assert.strictEqual (arguments.length, eq.length);
  return function eq$1(expected) {
    assert.strictEqual (arguments.length, eq$1.length);
    assert.strictEqual (show (actual), show (expected));
    assert.strictEqual (Z.equals (actual, expected), true);
  };
}


suite ('Either', () => {

  test ('metadata', () => {
    eq (typeof Left) ('function');
    eq (typeof Right) ('function');
    eq (Left.length) (1);
    eq (Right.length) (1);
  });

  test ('tags', () => {
    const left = Left (0);
    const right = Right (0);
    eq (left.isLeft) (true);
    eq (left.isRight) (false);
    eq (right.isLeft) (false);
    eq (right.isRight) (true);
  });

  test ('@@type', () => {
    eq (type (Left (0))) ('sanctuary-either/Either@1');
    eq (type (Right (0))) ('sanctuary-either/Either@1');
    eq (type.parse (type (Right (0))))
       ({namespace: 'sanctuary-either', name: 'Either', version: 1});
  });

  test ('@@show', () => {
    eq (show (Left (['foo', 'bar', 'baz'])))
       ('Left (["foo", "bar", "baz"])');
    eq (show (Right (['foo', 'bar', 'baz'])))
       ('Right (["foo", "bar", "baz"])');
    eq (show (Left (Right (Left (Right (-0))))))
       ('Left (Right (Left (Right (-0))))');
  });

});

suite ('type-class predicates', () => {

  test ('Setoid', () => {
    eq (Z.Setoid.test (Left (Useless))) (false);
    eq (Z.Setoid.test (Left (/(?:)/))) (true);
    eq (Z.Setoid.test (Right (Useless))) (false);
    eq (Z.Setoid.test (Right (/(?:)/))) (true);
  });

  test ('Ord', () => {
    eq (Z.Ord.test (Left (Useless))) (false);
    eq (Z.Ord.test (Left (/(?:)/))) (false);
    eq (Z.Ord.test (Left (0))) (true);
    eq (Z.Ord.test (Right (Useless))) (false);
    eq (Z.Ord.test (Right (/(?:)/))) (false);
    eq (Z.Ord.test (Right (0))) (true);
  });

  test ('Semigroupoid', () => {
    eq (Z.Semigroupoid.test (Left ([]))) (false);
    eq (Z.Semigroupoid.test (Right ([]))) (false);
  });

  test ('Category', () => {
    eq (Z.Category.test (Left ([]))) (false);
    eq (Z.Category.test (Right ([]))) (false);
  });

  test ('Semigroup', () => {
    eq (Z.Semigroup.test (Left (Useless))) (false);
    eq (Z.Semigroup.test (Left (0))) (false);
    eq (Z.Semigroup.test (Left ([]))) (true);
    eq (Z.Semigroup.test (Right (Useless))) (false);
    eq (Z.Semigroup.test (Right (0))) (false);
    eq (Z.Semigroup.test (Right ([]))) (true);
  });

  test ('Monoid', () => {
    eq (Z.Monoid.test (Left ([]))) (false);
    eq (Z.Monoid.test (Right ([]))) (false);
  });

  test ('Group', () => {
    eq (Z.Group.test (Left ([]))) (false);
    eq (Z.Group.test (Right ([]))) (false);
  });

  test ('Filterable', () => {
    eq (Z.Filterable.test (Left ([]))) (false);
    eq (Z.Filterable.test (Right ([]))) (false);
  });

  test ('Functor', () => {
    eq (Z.Functor.test (Left (Useless))) (true);
    eq (Z.Functor.test (Right (Useless))) (true);
  });

  test ('Bifunctor', () => {
    eq (Z.Bifunctor.test (Left (Useless))) (true);
    eq (Z.Bifunctor.test (Right (Useless))) (true);
  });

  test ('Profunctor', () => {
    eq (Z.Profunctor.test (Left (Math.sqrt))) (false);
    eq (Z.Profunctor.test (Right (Math.sqrt))) (false);
  });

  test ('Apply', () => {
    eq (Z.Apply.test (Left (Useless))) (true);
    eq (Z.Apply.test (Right (Useless))) (true);
  });

  test ('Applicative', () => {
    eq (Z.Applicative.test (Left (Useless))) (true);
    eq (Z.Applicative.test (Right (Useless))) (true);
  });

  test ('Chain', () => {
    eq (Z.Chain.test (Left (Useless))) (true);
    eq (Z.Chain.test (Right (Useless))) (true);
  });

  test ('ChainRec', () => {
    eq (Z.ChainRec.test (Left (Useless))) (true);
    eq (Z.ChainRec.test (Right (Useless))) (true);
  });

  test ('Monad', () => {
    eq (Z.Monad.test (Left (Useless))) (true);
    eq (Z.Monad.test (Right (Useless))) (true);
  });

  test ('Alt', () => {
    eq (Z.Alt.test (Left (Useless))) (true);
    eq (Z.Alt.test (Right (Useless))) (true);
  });

  test ('Plus', () => {
    eq (Z.Plus.test (Left ([]))) (false);
    eq (Z.Plus.test (Right ([]))) (false);
  });

  test ('Alternative', () => {
    eq (Z.Alternative.test (Left ([]))) (false);
    eq (Z.Alternative.test (Right ([]))) (false);
  });

  test ('Foldable', () => {
    eq (Z.Foldable.test (Left (Useless))) (true);
    eq (Z.Foldable.test (Right (Useless))) (true);
  });

  test ('Traversable', () => {
    eq (Z.Traversable.test (Left (Useless))) (true);
    eq (Z.Traversable.test (Right (Useless))) (true);
  });

  test ('Extend', () => {
    eq (Z.Extend.test (Left (Useless))) (true);
    eq (Z.Extend.test (Right (Useless))) (true);
  });

  test ('Comonad', () => {
    eq (Z.Comonad.test (Left (Identity (0)))) (false);
    eq (Z.Comonad.test (Right (Identity (0)))) (false);
  });

  test ('Contravariant', () => {
    eq (Z.Contravariant.test (Left (Math.sqrt))) (false);
    eq (Z.Contravariant.test (Right (Math.sqrt))) (false);
  });

});

suite ('Setoid laws', () => {
  testLaws (laws.Setoid) ({
    reflexivity: [
      EitherArb (jsc.string) (jsc.falsy),
    ],
    symmetry: [
      EitherArb (jsc.bool) (jsc.bool),
      EitherArb (jsc.bool) (jsc.bool),
    ],
    transitivity: [
      EitherArb (jsc.bool) (jsc.bool),
      EitherArb (jsc.bool) (jsc.bool),
      EitherArb (jsc.bool) (jsc.bool),
    ],
  });
});

suite ('Ord laws', () => {
  testLaws (laws.Ord) ({
    totality: [
      EitherArb (jsc.string) (jsc.number),
      EitherArb (jsc.string) (jsc.number),
    ],
    antisymmetry: [
      EitherArb (jsc.string) (jsc.number),
      EitherArb (jsc.string) (jsc.number),
    ],
    transitivity: [
      EitherArb (jsc.string) (jsc.number),
      EitherArb (jsc.string) (jsc.number),
      EitherArb (jsc.string) (jsc.number),
    ],
  });
});

suite ('Semigroup laws', () => {
  testLaws (laws.Semigroup (Z.equals)) ({
    associativity: [
      EitherArb (jsc.string) (jsc.string),
      EitherArb (jsc.string) (jsc.string),
      EitherArb (jsc.string) (jsc.string),
    ],
  });
});

suite ('Functor laws', () => {
  testLaws (laws.Functor (Z.equals)) ({
    identity: [
      EitherArb (jsc.string) (jsc.number),
    ],
    composition: [
      EitherArb (jsc.string) (jsc.number),
      jsc.constant (Math.sqrt),
      jsc.constant (Math.abs),
    ],
  });
});

suite ('Bifunctor laws', () => {
  testLaws (laws.Bifunctor (Z.equals)) ({
    identity: [
      EitherArb (jsc.string) (jsc.number),
    ],
    composition: [
      EitherArb (jsc.string) (jsc.number),
      jsc.constant (Math.sqrt),
      jsc.constant (s => s.length),
      jsc.constant (Math.sqrt),
      jsc.constant (Math.abs),
    ],
  });
});

suite ('Apply laws', () => {
  testLaws (laws.Apply (Z.equals)) ({
    composition: [
      EitherArb (jsc.string) (jsc.constant (Math.sqrt)),
      EitherArb (jsc.string) (jsc.constant (Math.abs)),
      EitherArb (jsc.string) (jsc.number),
    ],
  });
});

suite ('Applicative laws', () => {
  testLaws (laws.Applicative (Z.equals, Either)) ({
    identity: [
      EitherArb (jsc.string) (jsc.number),
    ],
    homomorphism: [
      jsc.constant (Math.abs),
      jsc.number,
    ],
    interchange: [
      EitherArb (jsc.string) (jsc.constant (Math.abs)),
      jsc.number,
    ],
  });
});

suite ('Chain laws', () => {
  testLaws (laws.Chain (Z.equals)) ({
    associativity: [
      EitherArb (jsc.string) (jsc.array (jsc.number)),
      jsc.constant (head),
      jsc.constant (sqrt),
    ],
  });
});

suite ('ChainRec laws', () => {
  testLaws (laws.ChainRec (Z.equals, Either)) ({
    equivalence: [
      jsc.constant (x => x >= 1000),
      jsc.constant (x => x <= 1 ? Left (show (x) + ' <= 1') : Right (x * x)),
      jsc.constant (Right),
      jsc.integer,
    ],
  });
});

suite ('Monad laws', () => {
  testLaws (laws.Monad (Z.equals, Either)) ({
    leftIdentity: [
      jsc.constant (sqrt),
      jsc.number,
    ],
    rightIdentity: [
      EitherArb (jsc.string) (jsc.number),
    ],
  });
});

suite ('Alt laws', () => {
  testLaws (laws.Alt (Z.equals)) ({
    associativity: [
      EitherArb (jsc.string) (jsc.number),
      EitherArb (jsc.string) (jsc.number),
      EitherArb (jsc.string) (jsc.number),
    ],
    distributivity: [
      EitherArb (jsc.string) (jsc.number),
      EitherArb (jsc.string) (jsc.number),
      jsc.constant (Math.sqrt),
    ],
  });
});

suite ('Foldable laws', () => {
  testLaws (laws.Foldable (Z.equals)) ({
    associativity: [
      jsc.constant ((x, y) => x + y),
      jsc.number,
      EitherArb (jsc.string) (jsc.number),
    ],
  });
});

suite ('Traversable laws', () => {
  testLaws (laws.Traversable (Z.equals)) ({
    naturality: [
      jsc.constant (Identity),
      jsc.constant (Array),
      jsc.constant (identity => [Z.extract (identity)]),
      EitherArb (jsc.string) (IdentityArb (jsc.number)),
    ],
    identity: [
      jsc.constant (Identity),
      EitherArb (jsc.string) (jsc.number),
    ],
    composition: [
      jsc.constant (Identity),
      jsc.constant (Either),
      EitherArb (jsc.string)
                (IdentityArb (EitherArb (jsc.string) (jsc.number))),
    ],
  });
});

suite ('Extend laws', () => {
  testLaws (laws.Extend (Z.equals)) ({
    associativity: [
      EitherArb (jsc.string) (jsc.integer),
      jsc.constant (either => Z.reduce ((x, y) => x + y, 1, either)),
      jsc.constant (either => Z.reduce ((x, y) => y * y, 1, either)),
    ],
  });
});
