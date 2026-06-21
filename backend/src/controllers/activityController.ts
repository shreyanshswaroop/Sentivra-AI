import { Request, Response, NextFunction } from "express";
import { Activity } from "../models/Activity";
import { logger } from "../utils/logger";
import { sendActivityCompletionEvent } from "../utils/inngestEvents";

// Log a new activity
export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, description, duration, difficulty, feedback } =
      req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`Activity logged for user ${userId}`);

    // Inngest is a background side effect; activity logging should still
    // succeed if the local Inngest/dev server is unavailable.
    try {
      await sendActivityCompletionEvent({
        userId,
        id: activity._id,
        type,
        name,
        duration,
        difficulty,
        feedback,
        timestamp: activity.timestamp,
      });
    } catch (error) {
      logger.warn("Activity saved, but completion event was not sent:", error);
    }

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// Get today's activities for the authenticated user
export const getTodayActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const activities = await Activity.find({
      userId,
      timestamp: {
        $gte: startOfToday,
        $lt: startOfTomorrow,
      },
    }).sort({ timestamp: -1 });

    res.json(activities);
  } catch (error) {
    next(error);
  }
};
