create policy "Public upload youtube videos"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'youtube-video-storage-bucket');

create policy "Public read youtube videos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'youtube-video-storage-bucket');

create policy "Public delete youtube videos"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'youtube-video-storage-bucket');
