import {
  $equals,
  either,
  map,
  of,
  "typeof" as $typeof,
} from "../serif/src/prelude.js";
import {
  "default" as show,
} from "sanctuary-show";
import {
  "default" as Z,
} from "sanctuary-type-classes";
export {
  EitherX,
  LeftX,
  RightX,
  eitherX,
};
let next = ((x) => ({
  tag: next,
  value: x,
}));
let done = ((x) => ({
  tag: done,
  value: x,
}));
let EitherX = globalThis["Object"]["assign"](globalThis["Object"]["create"](null), ({
  isLeft: false,
  isRight: false,
  "fantasy-land/of": (($1) => RightX($1)),
  "@@type": "sanctuary-either/Either@1",
  either: function(a) {
    return ((b) => eitherX(a)(b)(this));
  },
  "fantasy-land/chainRec": ((f, x) => function() {
    let r = next(x);
    let res;
    while ($equals(r["tag"], next)) {
      let either = f(next, done, r["value"]);
      if (either["isLeft"]) {
        (r["tag"] = done);
        (res = eitherX);
      }
 else {
        (r = either["value"]);
      }
    }
    return ((!($typeof(res) === "undefined")) ? res : RightX(r["value"]));
  }["call"](this)),
}));
(EitherX["constructor"] = EitherX);
let LeftPrototype = globalThis["Object"]["assign"](globalThis["Object"]["create"](EitherX), ({
  isLeft: true,
  "@@show": function() {
    return (("Left (" + show(this["value"])) + ")");
  },
  "fantasy-land/of": function(v) {
    return LeftX(v);
  },
  "fantasy-land/map": function(f) {
    return this;
  },
  "fantasy-land/bimap": function(f, g) {
    return LeftX(f(this["value"]));
  },
  "fantasy-land/chain": function(f) {
    return this;
  },
  "fantasy-land/alt": function(that) {
    return that;
  },
  "fantasy-land/reduce": function(f, x) {
    return x;
  },
  "fantasy-land/traverse": function(typeRep, f) {
    return of(typeRep)(this);
  },
  "fantasy-land/extend": function(f) {
    return this;
  },
  "fantasy-land/ap": function(that) {
    return (that["isLeft"] ? that : this);
  },
}));
let RightPrototype = globalThis["Object"]["assign"](globalThis["Object"]["create"](EitherX), ({
  isRight: true,
  "@@show": function() {
    return (("Right (" + show(this["value"])) + ")");
  },
  "fantasy-land/of": function(v) {
    return RightX(v);
  },
  "fantasy-land/map": function(f) {
    return RightX(f(this["value"]));
  },
  "fantasy-land/bimap": function(f, g) {
    return RightX(g(this["value"]));
  },
  "fantasy-land/chain": function(f) {
    return f(this["value"]);
  },
  "fantasy-land/alt": function(that) {
    return this;
  },
  "fantasy-land/reduce": function(f, x) {
    return f(x, this["value"]);
  },
  "fantasy-land/traverse": function(typeRep, f) {
    return map(RightX)(f(this["value"]));
  },
  "fantasy-land/extend": function(f) {
    return RightX(f(this));
  },
  "fantasy-land/ap": function(that) {
    return (that["isLeft"] ? that : RightX(that["value"](this["value"])));
  },
}));
let LeftXprototypeXequals = function(that) {
  return (that["isLeft"] && Z["equals"](this["value"], that["value"]));
};
let RightXprototypeXequals = function(that) {
  return (that["isRight"] && Z["equals"](this["value"], that["value"]));
};
let LeftXprototypeXlte = function(that) {
  return (that["isRight"] || Z["lte"](this["value"], that["value"]));
};
let RightXprototypeXlte = function(that) {
  return (that["isRight"] && Z["lte"](this["value"], that["value"]));
};
let LeftXprototypeXconcat = function(that) {
  return (that["isLeft"] ? LeftX(Z["concat"](this["value"], that["value"])) : that);
};
let RightXprototypeXconcat = function(that) {
  return (that["isRight"] ? RightX(Z["concat"](this["value"], that["value"])) : this);
};
let LeftX = ((a) => function() {
  let left = globalThis["Object"]["assign"](globalThis["Object"]["create"](LeftPrototype), ({
    value: a,
  }));
  if (Z["Setoid"]["test"](a)) {
    (left["fantasy-land/equals"] = LeftXprototypeXequals);
    if (Z["Ord"]["test"](a))     (left["fantasy-land/lte"] = LeftXprototypeXlte);
  }
  if (Z["Semigroup"]["test"](a))   (left["fantasy-land/concat"] = LeftXprototypeXconcat);
  return left;
}["call"](this));
let RightX = ((b) => function() {
  let right = globalThis["Object"]["assign"](globalThis["Object"]["create"](RightPrototype), ({
    value: b,
  }));
  if (Z["Setoid"]["test"](b)) {
    (right["fantasy-land/equals"] = RightXprototypeXequals);
    if (Z["Ord"]["test"](b))     (right["fantasy-land/lte"] = RightXprototypeXlte);
  }
  if (Z["Semigroup"]["test"](b))   (right["fantasy-land/concat"] = RightXprototypeXconcat);
  return right;
}["call"](this));
let eitherX = (($1) => (($2) => (($3) => ($3["isLeft"] ? $1($3["value"]) : $2($3["value"])))));
