// Generated on 2026-02-11T11:17:48.354Z by mcporter@0.0.0
// Server: time
// Source: ~/.mcporter/mcporter.json
// Transport: STDIO uvx mcp-server-time

import type { CallResult } from 'mcporter';

export interface TimeTools {
  /**
   * Get current time in a specific timezones
   *
   * @param timezone IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'Africa/Lagos'
   *                 as local timezone if no timezone provided by the user.
   */
  get_current_time(timezone: string): Promise<CallResult>;

  /**
   * Convert time between timezones
   *
   * @param source_timezone Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use
   *                        'Africa/Lagos' as local timezone if no source timezone provided by the user.
   * @param time Time to convert in 24-hour format (HH:MM)
   * @param target_timezone Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use
   *                        'Africa/Lagos' as local timezone if no target timezone provided by the user.
   */
  convert_time(source_timezone: string, time: string, target_timezone: string): Promise<CallResult>;
}

