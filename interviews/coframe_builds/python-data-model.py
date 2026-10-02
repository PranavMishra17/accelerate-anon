# Exercise: the data model traps (mutable defaults, late-binding closures, aliasing, copying).
# Run its test: python interviews/coframe_builds/python-data-model_test.py
import copy
import functools

_MISSING = object()  # sentinel for "not passed" when None is a valid value


def bad_append(x, acc=[]):  # default evaluated once, at def time: shared by every call
    acc.append(x)
    return acc


def good_append(x, acc=None):
    acc = [] if acc is None else acc
    acc.append(x)
    return acc


def late_bound():
    return [lambda: i for i in range(3)]  # each lambda reads i when called


def bound_now():
    return [lambda i=i: i for i in range(3)]  # default binds the value per iteration


def bound_partial():
    return [functools.partial(lambda i: i, i) for i in range(3)]


def aliased_rows(n):
    return [[0]] * n  # n references to ONE inner list


def fresh_rows(n):
    return [[0] for _ in range(n)]


def tuple_iadd():
    t = ([1], 2)
    try:
        t[0] += [3]  # list.__iadd__ mutates in place, then t[0] = ... fails
    except TypeError:
        return t, True
    return t, False


def copies(a):
    return copy.copy(a), copy.deepcopy(a)
