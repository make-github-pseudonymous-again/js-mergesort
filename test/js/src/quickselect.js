var all, util, array, random, compare, operator, functools, itertools, shuffle;

util = require( "util" );
array = require( "aureooms-js-array" );
random = require( "aureooms-js-random" );
compare = require( "aureooms-js-compare" );
operator = require( "aureooms-js-operator" );
functools = require( "aureooms-js-functools" );
itertools = require( "aureooms-js-itertools" );

shuffle = random.__shuffle__( random.__sample__( random.randint ) );

all = function ( quickselectname, quickselect, comparename, compare, n, type ) {

	var title;

	title = util.format( "%s (new %s(%d), %s)", quickselectname, type.name, n, comparename );

	console.log( title );

	test( title, function () {

		var a, i, ref;

		// SETUP REF ARRAY
		ref = new type( n );
		array.iota(ref, 0, n, 0);
		array.sort( compare, ref );

		// SETUP TEST ARRAY
		a = new type( n );
		array.copy( ref, 0, n, a, 0 );

		// TEST ALL INDEX SELECTION
		i = a.length;
		while ( i-- ) {
			shuffle( a, 0, n );
			quickselect( compare, a, 0, n, i );
			deepEqual( a[i], ref[i], "select #" + i );
		}

		deepEqual( a.length, n, "check length" );
	});
};

itertools.product( [

[
	[ "quickselect (hoare)", sort.__quickselect__( sort.hoare ) ],
	[ "quickselect (lomuto)", sort.__quickselect__( sort.lomuto ) ]
],

[
	[ "increasing", compare.increasing ],
	[ "decreasing", compare.decreasing ]
],

[0, 1, 2, 10, 31, 32, 33],

[
	Array,
	Int8Array,
	Uint8Array,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
]

], 1, [] ).forEach(

	functools.partial( functools.star,

		function ( quickselectname, quickselect, comparename, compare, n, type ) {

			if ( type.BYTES_PER_ELEMENT && n > Math.pow( 2, type.BYTES_PER_ELEMENT * 8 ) ) {
				return;
			}

			all( quickselectname, quickselect, comparename, compare, n, type );
		}
	)

);