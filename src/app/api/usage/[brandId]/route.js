// import { query } from "@/lib/db";
// import { verifyToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function GET(request, { params }) {
//   try {
//     // Verify token
//     const authHeader = request.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json(
//         { error: "Authorization header missing" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);

//     // Verify brand ID matches
//     if (decoded.brandId !== parseInt(params.brandId)) {
//       return NextResponse.json(
//         { error: "Unauthorized access" },
//         { status: 403 }
//       );
//     }

//     // Get usage data
//     const result = await query(
//       `SELECT id, brand_id, date, total_requests as "totalRequests", successful_requests as "successfulRequests", failed_requests as "failedRequests", (failed_requests::FLOAT / total_requests * 100) as "errorRate" FROM api_usage WHERE brand_id = $1 ORDER BY date ASC`,
//       [params.brandId]
//     );

//     return NextResponse.json(result.rows);
//   } catch (error) {
//     console.error("Usage data error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
// import { query } from "@/lib/db";
// import { verifyToken } from "@/lib/auth";
// import { NextResponse } from "next/server";
// export async function GET(request, { params }) {
//   try {
//     // Verify token
//     const authHeader = request.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json(
//         { error: "Authorization header missing" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);

//     // Verify brand ID matches
//     // Properly access the brandId from params
//     const { brandId } = params;
//     if (decoded.brandId !== parseInt(brandId)) {
//       return NextResponse.json(
//         { error: "Unauthorized access" },
//         { status: 403 }
//       );
//     }

//     // Get usage data
//     // const result = await query(
//     //   `SELECT
//     //     id,
//     //     brand_id
//     //     date,
//     //     total_requests as "totalRequests",
//     //     successful_requests as "successfulRequests",
//     //     failed_requests as "failedRequests",
//     //     (failed_requests::FLOAT / total_requests * 100) as "errorRate"
//     //    FROM api_usage
//     //    WHERE brand_id = $1
//     //    ORDER BY date ASC`,
//     //   [brandId] // Use the destructured brandId
//     // );
//     const result = await query(
//       `SELECT
//           id,
//           date::text as date,  // Convert date to string
//           total_requests as "totalRequests",
//           successful_requests as "successfulRequests",
//           failed_requests as "failedRequests",
//           (failed_requests::FLOAT / total_requests * 100) as "errorRate"
//          FROM api_usage
//          WHERE brand_id = $1
//          ORDER BY date ASC`,
//       [brandId]
//     );

//     // return NextResponse.json(result.rows);

//     // In your API route
//     const transformedRows = result.rows.map((row) => ({
//       ...row,
//       date: new Date(row.date).toISOString(), // Convert numeric date to ISO string
//     }));
//     return NextResponse.json(transformedRows);
//   } catch (error) {
//     console.error("Usage data error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Verify authorization header exists
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    // Extract and verify token
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Validate brandId parameter
    const { brandId } = params;
    if (!brandId || isNaN(parseInt(brandId))) {
      return NextResponse.json(
        { error: "Invalid brand ID format" },
        { status: 400 }
      );
    }

    // Verify brand authorization
    if (decoded.brandId !== parseInt(brandId)) {
      return NextResponse.json(
        { error: "Unauthorized access to this brand's data" },
        { status: 403 }
      );
    }

    // Fetch usage data from database
    const result = await query(
      `SELECT 
        id,
        date::text as date,
        total_requests as "totalRequests",
        successful_requests as "successfulRequests",
        failed_requests as "failedRequests",
        (failed_requests::FLOAT / NULLIF(total_requests, 0) * 100) as "errorRate"
       FROM api_usage
       WHERE brand_id = $1
       ORDER BY date ASC`,
      [brandId]
    );

    // Transform and validate data
    const transformedData = result.rows.map((row) => {
      // Handle potential invalid dates
      let date;
      try {
        date = row.date
          ? new Date(row.date).toISOString()
          : new Date().toISOString();
      } catch {
        date = new Date().toISOString();
      }

      return {
        ...row,
        date,
        errorRate: row.errorRate || 0, // Ensure errorRate always has a value
      };
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("API Usage Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
