type PostLike = {
  id: string;
  data: {
    date?: Date;
  };
};

export function getPostDate(post: PostLike) {
  if (post.data.date) return post.data.date;
  const match = post.id.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!match) return new Date(0);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatPostDate(date: Date) {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
