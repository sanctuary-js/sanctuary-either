/*
         _______    ___    _________    ___   ___    _______    ______
        /  ____/\  /  /\  /__   ___/\  /  /\ /  /\  /  ____/\  /  __  \
       /  /\___\/ /  / /  \_/  /\__\/ /  /_//  / / /  /\___\/ /  /\/  /\
      /  ____/\  /  / /    /  / /    /  ___   / / /  ____/\  /      _/ /
     /  /\___\/ /  / /    /  / /    /  /\_/  / / /  /\___\/ /  /|  |\\/
    /______/\  /__/ /    /__/ /    /__/ //__/ / /______/\  /__/ |__| |
    \______\/  \__\/     \__\/     \__\/ \__\/  \______\/  \__\/ \__\|
                                                                            */

//. <a href="https://github.com/fantasyland/fantasy-land"><img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="75" height="75" align="left"></a>
//.
//. # sanctuary-either
//.
//. The Either type represents values with two possibilities: a value of type
//. `Either a b` is either a Left whose value is of type `a` or a Right whose
//. value is of type `b`.

(function(f) {

  'use strict';

  var util = {inspect: {}};

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f (require ('util'),
                        require ('sanctuary-show'),
                        require ('sanctuary-type-classes'));
  } else if (typeof define === 'function' && define.amd != null) {
    define (['sanctuary-show', 'sanctuary-type-classes'], function(show, Z) {
      return f (util, show, Z);
    });
  } else {
    self.sanctuaryEither = f (util,
                              self.sanctuaryShow,
                              self.sanctuaryTypeClasses);
  }

} (function(util, show, Z) {

  'use strict';

  /* istanbul ignore if */
  if (typeof __doctest !== 'undefined') {
    var $ = __doctest.require ('sanctuary-def');
    var type = __doctest.require ('sanctuary-type-identifiers');
    var S = (function() {
      var S = __doctest.require ('sanctuary');
      var EitherType = $.BinaryType
        ('sanctuary-either/Either')
        ('')
        (function(x) { return type (x) === Either['@@type']; })
        (function(e) { return e.isLeft ? [e.value] : []; })
        (function(e) { return e.isLeft ? [] : [e.value]; });
      var env = Z.concat (S.env,
                          [$.TypeClass, EitherType ($.Unknown) ($.Unknown)]);
      return S.create ({checkTypes: true, env: env});
    } ());
  }

  var Either = {};

  var Left$prototype = {
    /* eslint-disable key-spacing */
    'constructor':            Either,
    'isLeft':                 true,
    'isRight':                false,
    '@@show':                 Left$prototype$show,
    'fantasy-land/map':       Left$prototype$map,
    'fantasy-land/bimap':     Left$prototype$bimap,
    'fantasy-land/ap':        Left$prototype$ap,
    'fantasy-land/chain':     Left$prototype$chain,
    'fantasy-land/alt':       Left$prototype$alt,
    'fantasy-land/reduce':    Left$prototype$reduce,
    'fantasy-land/traverse':  Left$prototype$traverse,
    'fantasy-land/extend':    Left$prototype$extend
    /* eslint-enable key-spacing */
  };

  var Right$prototype = {
    /* eslint-disable key-spacing */
    'constructor':            Either,
    'isLeft':                 false,
    'isRight':                true,
    '@@show':                 Right$prototype$show,
    'fantasy-land/map':       Right$prototype$map,
    'fantasy-land/bimap':     Right$prototype$bimap,
    'fantasy-land/ap':        Right$prototype$ap,
    'fantasy-land/chain':     Right$prototype$chain,
    'fantasy-land/alt':       Right$prototype$alt,
    'fantasy-land/reduce':    Right$prototype$reduce,
    'fantasy-land/traverse':  Right$prototype$traverse,
    'fantasy-land/extend':    Right$prototype$extend
    /* eslint-enable key-spacing */
  };

  var custom = util.inspect.custom;
  /* istanbul ignore else */
  if (typeof custom === 'symbol') {
    Left$prototype[custom] = Left$prototype$show;
    Right$prototype[custom] = Right$prototype$show;
  } else {
    Left$prototype.inspect = Left$prototype$show;
    Right$prototype.inspect = Right$prototype$show;
  }

  //. `Either a b` satisfies the following [Fantasy Land][] specifications:
  //.
  //. ```javascript
  //. > const Useless = require ('sanctuary-useless')
  //.
  //. > S.map (k => k + ' '.repeat (16 - k.length) +
  //. .             (Z[k].test (Right (Useless)) ? '\u2705   ' :
  //. .              Z[k].test (Right (['foo'])) ? '\u2705 * ' :
  //. .              /* otherwise */               '\u274C   '))
  //. .       (S.keys (S.unchecked.filter (S.is ($.TypeClass)) (Z)))
  //. [ 'Setoid          ✅ * ',  // if ‘a’ and ‘b’ satisfy Setoid
  //. . 'Ord             ✅ * ',  // if ‘a’ and ‘b’ satisfy Ord
  //. . 'Semigroupoid    ❌   ',
  //. . 'Category        ❌   ',
  //. . 'Semigroup       ✅ * ',  // if ‘a’ and ‘b’ satisfy Semigroup
  //. . 'Monoid          ❌   ',
  //. . 'Group           ❌   ',
  //. . 'Filterable      ❌   ',
  //. . 'Functor         ✅   ',
  //. . 'Bifunctor       ✅   ',
  //. . 'Profunctor      ❌   ',
  //. . 'Apply           ✅   ',
  //. . 'Applicative     ✅   ',
  //. . 'Chain           ✅   ',
  //. . 'ChainRec        ✅   ',
  //. . 'Monad           ✅   ',
  //. . 'Alt             ✅   ',
  //. . 'Plus            ❌   ',
  //. . 'Alternative     ❌   ',
  //. . 'Foldable        ✅   ',
  //. . 'Traversable     ✅   ',
  //. . 'Extend          ✅   ',
  //. . 'Comonad         ❌   ',
  //. . 'Contravariant   ❌   ' ]
  //. ```

  //# Either :: TypeRep Either
  //.
  //. Either [type representative][].

  //# Either.Left :: a -> Either a b
  //.
  //. Constructs a value of type `Either a b` from a value of type `a`.
  //.
  //. ```javascript
  //. > Left ('sqrt undefined for -1')
  //. Left ('sqrt undefined for -1')
  //. ```
  var Left = Either.Left = function(value) {
    var left = Object.create (Left$prototype);
    if (Z.Setoid.test (value)) {
      left['fantasy-land/equals'] = Left$prototype$equals;
      if (Z.Ord.test (value)) {
        left['fantasy-land/lte'] = Left$prototype$lte;
      }
    }
    if (Z.Semigroup.test (value)) {
      left['fantasy-land/concat'] = Left$prototype$concat;
    }
    left.value = value;
    return left;
  };

  //# Either.Right :: b -> Either a b
  //.
  //. Constructs a value of type `Either a b` from a value of type `b`.
  //.
  //. ```javascript
  //. > Right (42)
  //. Right (42)
  //. ```
  var Right = Either.Right = function Right(value) {
    var right = Object.create (Right$prototype);
    if (Z.Setoid.test (value)) {
      right['fantasy-land/equals'] = Right$prototype$equals;
      if (Z.Ord.test (value)) {
        right['fantasy-land/lte'] = Right$prototype$lte;
      }
    }
    if (Z.Semigroup.test (value)) {
      right['fantasy-land/concat'] = Right$prototype$concat;
    }
    right.value = value;
    return right;
  };

  //# Either.@@type :: String
  //.
  //. Either [type identifier][].
  //.
  //. ```javascript
  //. > type (Right (42))
  //. 'sanctuary-either/Either@1'
  //.
  //. > type.parse (type (Right (42)))
  //. {namespace: 'sanctuary-either', name: 'Either', version: 1}
  //. ```
  Either['@@type'] = 'sanctuary-either/Either@1';

  //# Either.fantasy-land/of :: b -> Either a b
  //.
  //.   - `of (Either) (x)` is equivalent to `Right (x)`
  //.
  //. ```javascript
  //. > S.of (Either) (42)
  //. Right (42)
  //. ```
  Either['fantasy-land/of'] = Right;

  function next(x) { return {tag: next, value: x}; }
  function done(x) { return {tag: done, value: x}; }

  //# Either.fantasy-land/chainRec :: ((a -> c, b -> c, a) -> Either d c, a) -> Either d b
  //.
  //. ```javascript
  //. > Z.chainRec (
  //. .   Either,
  //. .   (next, done, x) =>
  //. .     x <= 1 ? Left ('!!') : Right (x >= 1000 ? done (x) : next (x * x)),
  //. .   1
  //. . )
  //. Left ('!!')
  //.
  //. > Z.chainRec (
  //. .   Either,
  //. .   (next, done, x) =>
  //. .     x <= 1 ? Left ('!!') : Right (x >= 1000 ? done (x) : next (x * x)),
  //. .   2
  //. . )
  //. Right (65536)
  //. ```
  Either['fantasy-land/chainRec'] = function(f, x) {
    var r = next (x);
    while (r.tag === next) {
      var either = f (next, done, r.value);
      if (either.isLeft) return either;
      r = either.value;
    }
    return Right (r.value);
  };

  //# Either#@@show :: (Showable a, Showable b) => Either a b ~> () -> String
  //.
  //.   - `show (Left (x))` is equivalent to `'Left (' + show (x) + ')'`
  //.   - `show (Right (x))` is equivalent to `'Right (' + show (x) + ')'`
  //.
  //. ```javascript
  //. > show (Left ('sqrt undefined for -1'))
  //. 'Left ("sqrt undefined for -1")'
  //.
  //. > show (Right ([1, 2, 3]))
  //. 'Right ([1, 2, 3])'
  //. ```
  function Left$prototype$show() {
    return 'Left (' + show (this.value) + ')';
  }
  function Right$prototype$show() {
    return 'Right (' + show (this.value) + ')';
  }

  //# Either#fantasy-land/equals :: (Setoid a, Setoid b) => Either a b ~> Either a b -> Boolean
  //.
  //.   - `Left (x)` is equal to `Left (y)` [iff][] `x` is equal to `y`
  //.     according to [`Z.equals`][]
  //.   - `Right (x)` is equal to `Right (y)` [iff][] `x` is equal to `y`
  //.     according to [`Z.equals`][]
  //.   - `Left (x)` is never equal to `Right (y)`
  //.
  //. ```javascript
  //. > S.equals (Left ([1, 2, 3])) (Left ([1, 2, 3]))
  //. true
  //.
  //. > S.equals (Right ([1, 2, 3])) (Right ([1, 2, 3]))
  //. true
  //.
  //. > S.equals (Left ([1, 2, 3])) (Right ([1, 2, 3]))
  //. false
  //. ```
  function Left$prototype$equals(other) {
    return other.isLeft && Z.equals (this.value, other.value);
  }
  function Right$prototype$equals(other) {
    return other.isRight && Z.equals (this.value, other.value);
  }

  //# Either#fantasy-land/lte :: (Ord a, Ord b) => Either a b ~> Either a b -> Boolean
  //.
  //.   - `Left (x)` is less than or equal to `Left (y)` [iff][] `x` is less
  //.     than or equal to `y` according to [`Z.lte`][]
  //.   - `Right (x)` is less than or equal to `Right (y)` [iff][] `x` is less
  //.     than or equal to `y` according to [`Z.lte`][]
  //.   - `Left (x)` is always less than `Right (y)`
  //.
  //. ```javascript
  //. > S.filter (S.lte (Left (1))) ([Left (0), Left (1), Left (2)])
  //. [Left (0), Left (1)]
  //.
  //. > S.filter (S.lte (Right (1))) ([Right (0), Right (1), Right (2)])
  //. [Right (0), Right (1)]
  //.
  //. > S.filter (S.lte (Left (1))) ([Right (0), Right (1), Right (2)])
  //. []
  //.
  //. > S.filter (S.lte (Right (1))) ([Left (0), Left (1), Left (2)])
  //. [Left (0), Left (1), Left (2)]
  //. ```
  function Left$prototype$lte(other) {
    return other.isRight || Z.lte (this.value, other.value);
  }
  function Right$prototype$lte(other) {
    return other.isRight && Z.lte (this.value, other.value);
  }

  //# Either#fantasy-land/concat :: (Semigroup a, Semigroup b) => Either a b ~> Either a b -> Either a b
  //.
  //.   - `concat (Left (x)) (Left (y))` is equivalent to
  //.     `Left (concat (x) (y))`
  //.   - `concat (Right (x)) (Right (y))` is equivalent to
  //.     `Right (concat (x) (y))`
  //.   - `concat (Left (x)) (Right (y))` is equivalent to `Right (y)`
  //.   - `concat (Right (x)) (Left (y))` is equivalent to `Right (x)`
  //.
  //. ```javascript
  //. > S.concat (Left ('abc')) (Left ('def'))
  //. Left ('abcdef')
  //.
  //. > S.concat (Right ([1, 2, 3])) (Right ([4, 5, 6]))
  //. Right ([1, 2, 3, 4, 5, 6])
  //.
  //. > S.concat (Left ('abc')) (Right ([1, 2, 3]))
  //. Right ([1, 2, 3])
  //.
  //. > S.concat (Right ([1, 2, 3])) (Left ('abc'))
  //. Right ([1, 2, 3])
  //. ```
  function Left$prototype$concat(other) {
    return other.isLeft ? Left (Z.concat (this.value, other.value)) : other;
  }
  function Right$prototype$concat(other) {
    return other.isRight ? Right (Z.concat (this.value, other.value)) : this;
  }

  //# Either#fantasy-land/map :: Either a b ~> (b -> c) -> Either a c
  //.
  //.   - `map (f) (Left (x))` is equivalent to `Left (x)`
  //.   - `map (f) (Right (x))` is equivalent to `Right (f (x))`
  //.
  //. ```javascript
  //. > S.map (S.add (1)) (Left ('sqrt undefined for -1'))
  //. Left ('sqrt undefined for -1')
  //.
  //. > S.map (S.add (1)) (Right (99))
  //. Right (100)
  //. ```
  function Left$prototype$map(f) {
    return this;
  }
  function Right$prototype$map(f) {
    return Right (f (this.value));
  }

  //# Either#fantasy-land/bimap :: Either a c ~> (a -> b, c -> d) -> Either b d
  //.
  //.   - `bimap (f) (g) (Left (x))` is equivalent to `Left (f (x))`
  //.   - `bimap (f) (g) (Right (x))` is equivalent to `Right (g (x))`
  //.
  //. ```javascript
  //. > S.bimap (S.toUpper) (S.add (1)) (Left ('abc'))
  //. Left ('ABC')
  //.
  //. > S.bimap (S.toUpper) (S.add (1)) (Right (99))
  //. Right (100)
  //. ```
  function Left$prototype$bimap(f, g) {
    return Left (f (this.value));
  }
  function Right$prototype$bimap(f, g) {
    return Right (g (this.value));
  }

  //# Either#fantasy-land/ap :: Either a b ~> Either a (b -> c) -> Either a c
  //.
  //.   - `ap (Left (x)) (Left (y))` is equivalent to `Left (x)`
  //.   - `ap (Left (x)) (Right (y))` is equivalent to `Left (x)`
  //.   - `ap (Right (f)) (Left (x))` is equivalent to `Left (x)`
  //.   - `ap (Right (f)) (Right (x))` is equivalent to `Right (f (x))`
  //.
  //. ```javascript
  //. > S.ap (Left ('div undefined for 0')) (Left ('sqrt undefined for -1'))
  //. Left ('div undefined for 0')
  //.
  //. > S.ap (Left ('div undefined for 0')) (Right (99))
  //. Left ('div undefined for 0')
  //.
  //. > S.ap (Right (S.add (1))) (Left ('sqrt undefined for -1'))
  //. Left ('sqrt undefined for -1')
  //.
  //. > S.ap (Right (S.add (1))) (Right (99))
  //. Right (100)
  //. ```
  function Left$prototype$ap(other) {
    return other.isLeft ? other : this;
  }
  function Right$prototype$ap(other) {
    return other.isLeft ? other : Right (other.value (this.value));
  }

  //# Either#fantasy-land/chain :: Either a b ~> (b -> Either a c) -> Either a c
  //.
  //.   - `chain (f) (Left (x))` is equivalent to `Left (x)`
  //.   - `chain (f) (Right (x))` is equivalent to `f (x)`
  //.
  //. ```javascript
  //. > const sqrt = n => n < 0 ? Left ('sqrt undefined for ' + show (n))
  //. .                         : Right (Math.sqrt (n))
  //.
  //. > S.chain (sqrt) (Left ('div undefined for 0'))
  //. Left ('div undefined for 0')
  //.
  //. > S.chain (sqrt) (Right (-1))
  //. Left ('sqrt undefined for -1')
  //.
  //. > S.chain (sqrt) (Right (25))
  //. Right (5)
  //. ```
  function Left$prototype$chain(f) {
    return this;
  }
  function Right$prototype$chain(f) {
    return f (this.value);
  }

  //# Either#fantasy-land/alt :: Either a b ~> Either a b -> Either a b
  //.
  //.   - `alt (Left (x)) (Left (y))` is equivalent to `Left (y)`
  //.   - `alt (Left (x)) (Right (y))` is equivalent to `Right (y)`
  //.   - `alt (Right (x)) (Left (y))` is equivalent to `Right (x)`
  //.   - `alt (Right (x)) (Right (y))` is equivalent to `Right (x)`
  //.
  //. ```javascript
  //. > S.alt (Left ('A')) (Left ('B'))
  //. Left ('B')
  //.
  //. > S.alt (Left ('C')) (Right (1))
  //. Right (1)
  //.
  //. > S.alt (Right (2)) (Left ('D'))
  //. Right (2)
  //.
  //. > S.alt (Right (3)) (Right (4))
  //. Right (3)
  //. ```
  function Left$prototype$alt(other) {
    return other;
  }
  function Right$prototype$alt(other) {
    return this;
  }

  //# Either#fantasy-land/reduce :: Either a b ~> ((c, b) -> c, c) -> c
  //.
  //.   - `reduce (f) (x) (Left (y))` is equivalent to `x`
  //.   - `reduce (f) (x) (Right (y))` is equivalent to `f (x) (y)`
  //.
  //. ```javascript
  //. > S.reduce (S.concat) ([1]) (Left ('sqrt undefined for -1'))
  //. [1]
  //.
  //. > S.reduce (S.concat) ([1]) (Right ([2]))
  //. [1, 2]
  //. ```
  function Left$prototype$reduce(f, x) {
    return x;
  }
  function Right$prototype$reduce(f, x) {
    return f (x, this.value);
  }

  //# Either#fantasy-land/traverse :: Applicative f => Either a b ~> (TypeRep f, b -> f c) -> f (Either a c)
  //.
  //.   - `traverse (A) (f) (Left (x))` is equivalent to `of (A) (Left (x))`
  //.   - `traverse (A) (f) (Right (x))` is equivalent to `map (Right) (f (x))`
  //.
  //. ```javascript
  //. > S.traverse (Array) (S.words) (Left ('sqrt undefined for -1'))
  //. [Left ('sqrt undefined for -1')]
  //.
  //. > S.traverse (Array) (S.words) (Right ('foo bar baz'))
  //. [Right ('foo'), Right ('bar'), Right ('baz')]
  //. ```
  function Left$prototype$traverse(typeRep, f) {
    return Z.of (typeRep, this);
  }
  function Right$prototype$traverse(typeRep, f) {
    return Z.map (Right, f (this.value));
  }

  //# Either#fantasy-land/extend :: Either a b ~> (Either a b -> c) -> Either a c
  //.
  //.   - `extend (f) (Left (x))` is equivalent to `Left (x)`
  //.   - `extend (f) (Right (x))` is equivalent to `Right (f (Right (x)))`
  //.
  //. ```javascript
  //. > S.extend (S.reduce (S.add) (1)) (Left ('sqrt undefined for -1'))
  //. Left ('sqrt undefined for -1')
  //.
  //. > S.extend (S.reduce (S.add) (1)) (Right (99))
  //. Right (100)
  //. ```
  function Left$prototype$extend(f) {
    return this;
  }
  function Right$prototype$extend(f) {
    return Right (f (this));
  }

  return Either;

}));

//. [Fantasy Land]:             v:fantasyland/fantasy-land
//. [`Z.equals`]:               v:sanctuary-js/sanctuary-type-classes#equals
//. [`Z.lte`]:                  v:sanctuary-js/sanctuary-type-classes#lte
//. [iff]:                      https://en.wikipedia.org/wiki/If_and_only_if
//. [type identifier]:          v:sanctuary-js/sanctuary-type-identifiers
//. [type representative]:      v:fantasyland/fantasy-land#type-representatives
