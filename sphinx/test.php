<?php

//
// $Id: test.php 2903 2011-08-04 13:30:49Z shodan $
//

require ( "./sphinx-2.2.11-release/api/sphinxapi.php" );

//////////////////////
// parse command line
//////////////////////

$cl = new SphinxClient ();

$reflector = new \ReflectionClass('SphinxClient');
echo $reflector->getFileName();

$queryString = "zozo"; // `zozo` is one on the example rows in README.md

$host = "localhost";
$port = 9311;

$sql = "";
$mode = SPH_MATCH_ALL;

$index = "*";
$groupby = "";
$groupsort = "@group desc";
$filter = "group_id";
$filtervals = array();
$distinct = "";
$sortby = "";
$sortexpr = "";
$limit = 20;
$ranker = SPH_RANK_PROXIMITY_BM25;
$select = "";


////////////
// do query
////////////

$cl->SetServer ( $host, $port );
$cl->SetConnectTimeout ( 1 );
$cl->SetArrayResult ( true );
$cl->SetMatchMode ( $mode );
$res = $cl->Query ( $queryString, $index );

////////////////
// print me out
////////////////

if ( $res===false )
{
	print "Query failed: " . $cl->GetLastError() . ".\n";

} else
{
	if ( $cl->GetLastWarning() )
		print "WARNING: " . $cl->GetLastWarning() . "\n\n";

	print "Query '$queryString' retrieved $res[total] of $res[total_found] matches in $res[time] sec.\n";
	print "Query stats:\n";
	if ( is_array($res["words"]) )
		foreach ( $res["words"] as $word => $info )
			print "    '$word' found $info[hits] times in $info[docs] documents\n";
	print "\n";

	if ( is_array($res["matches"]) )
	{
		$n = 1;
		print "Matches:\n";
		foreach ( $res["matches"] as $docinfo )
		{
			print "$n. doc_id=$docinfo[id], weight=$docinfo[weight]";
			foreach ( $res["attrs"] as $attrname => $attrtype )
			{
				$value = $docinfo["attrs"][$attrname];
				if ( $attrtype==SPH_ATTR_MULTI || $attrtype==SPH_ATTR_MULTI64 )
				{
					$value = "(" . join ( ",", $value ) .")";
				} else
				{
					if ( $attrtype==SPH_ATTR_TIMESTAMP )
						$value = date ( "Y-m-d H:i:s", $value );
				}
				print ", $attrname=$value";
			}
			print "\n";
			$n++;
		}
	}
}

//
// $Id: test.php 2903 2011-08-04 13:30:49Z shodan $
//

?>