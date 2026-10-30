from supabase_client import supabase


def get_users_for_assignment(
    current_user_id: str,
    search: str,
    page: int,
    page_size: int,
) -> dict:

    start = (page - 1) * page_size
    end = start + page_size - 1

    # Retrieve only the profile information needed for task assignment.
    query = (
        supabase
        .table("profiles")
        .select(
            "user_id, full_name, email, avatar_url",
            count="exact",
        )
        .neq("user_id", current_user_id)
    )

    # Search by user name or email.
    if search:
        query = query.or_(
            f"full_name.ilike.%{search}%,email.ilike.%{search}%"
        )

    response = (
        query
        .order("full_name")
        .range(start, end)
        .execute()
    )

    rows = response.data or []

    users = [
        {
            "id": user["user_id"],
            "fullName": user.get("full_name"),
            "email": user.get("email"),
            "avatarUrl": user.get("avatar_url"),
        }
        for user in rows
    ]

    total = response.count if response.count is not None else len(users)
    total_pages = (total + page_size - 1) // page_size

    return {
        "users": users,
        "pagination": {
            "page": page,
            "limit": page_size,
            "total": total,
            "totalPages": total_pages,
            "hasMore": page < total_pages,
        },
    }